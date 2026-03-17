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
  // If dimensions are provided, group by them. 
  // If no dimensions but metrics are provided, group everything into one row to get a total.
  if (dimensions.length > 0 || metrics.length > 0) {
    const groupId = {};
    if (dimensions.length > 0) {
      dimensions.forEach(dim => {
        groupId[dim] = `$data.${dim}`;
      });
    } else {
      // Fallback: group by a constant label if no dimensions but metrics exist (e.g. "Total")
      // This allows the frontend to show a single bar/row.
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
