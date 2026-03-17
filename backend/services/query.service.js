const mongoose = require('mongoose');
const Dataset = require('../models/Dataset');

const executeAggregation = async (datasetId, chartConfig) => {
  const { metrics = [], dimensions = [], filters = {} } = chartConfig;
  
  const pipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(datasetId) } },
    { $unwind: "$data" }
  ];

  // 1. Filtering
  if (Object.keys(filters).length > 0) {
    const filterStage = {};
    for (const [key, value] of Object.entries(filters)) {
      filterStage[`data.${key}`] = value;
    }
    pipeline.push({ $match: filterStage });
  }

  // 2. Grouping
  const { groups = [] } = chartConfig;

  // Helper to convert typical filter object into internal aggregation expression for $cond
  const convertFilterToExpression = (f) => {
    const parts = [];
    for (const [key, val] of Object.entries(f)) {
      const field = `$data.${key}`;
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        for (const [op, opVal] of Object.entries(val)) {
          if (op === '$gt') parts.push({ $gt: [field, opVal] });
          else if (op === '$gte') parts.push({ $gte: [field, opVal] });
          else if (op === '$lt') parts.push({ $lt: [field, opVal] });
          else if (op === '$lte') parts.push({ $lte: [field, opVal] });
          else if (op === '$ne') parts.push({ $ne: [field, opVal] });
          else if (op === '$in') parts.push({ $in: [field, opVal] });
        }
      } else {
        parts.push({ $eq: [field, val] });
      }
    }
    return parts.length === 1 ? parts[0] : { $and: parts };
  };

  if (groups.length > 0 || dimensions.length > 0 || metrics.length > 0) {
    let groupId = {};
    
    if (groups.length > 0) {
      // Comparison logic: uses $cond to bucket rows
      const branches = [];
      let defaultLabel = 'Others';

      groups.forEach(g => {
        if (g.filter === 'rest' || !g.filter) {
          defaultLabel = g.label;
        } else {
          branches.push({
            case: convertFilterToExpression(g.filter),
            then: g.label
          });
        }
      });

      groupId["Comparison"] = {
        $switch: {
          branches: branches,
          default: defaultLabel
        }
      };
    } else if (dimensions.length > 0) {
      dimensions.forEach(dim => {
        groupId[dim] = `$data.${dim}`;
      });
    } else {
      groupId["Summary"] = { $literal: "Total" };
    }

    const groupStage = { _id: groupId };
    
    if (metrics.length > 0) {
      metrics.forEach(metric => {
        if (metric === 'Count') {
          groupStage.Count = { $sum: 1 };
        } else {
          groupStage[metric] = {
            $sum: {
              $convert: {
                input: `$data.${metric}`,
                to: 'double',
                onError: 0,
                onNull: 0
              }
            }
          };
        }
      });
    } else {
      groupStage.Count = { $sum: 1 };
    }
    
    pipeline.push({ $group: groupStage });
  } else {
    // If no dimensions and no metrics (User just asked for "data"), 
    // we just limit it to 100 rows to avoid crashing the UI.
    pipeline.push({ $limit: 100 });
    pipeline.push({ $project: { _id: 0, data: 1 } });
  }

  // Execute pipeline
  const results = await Dataset.aggregate(pipeline);

  // 3. Format result for Recharts
  const formattedResults = results.map(row => {
    if (row._id) {
       const flatRow = { ...row._id, ...row };
       delete flatRow._id;
       return flatRow;
    }
    // If it's a raw listing (no group), return the inner data object
    return row.data || row;
  });

  return formattedResults;
};

module.exports = { executeAggregation };
