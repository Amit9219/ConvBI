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
  if (dimensions.length > 0) {
    const groupId = {};
    dimensions.forEach(dim => {
      groupId[dim] = `$data.${dim}`;
    });

    const groupStage = { _id: groupId };
    
    if (metrics.length > 0) {
      metrics.forEach(metric => {
        // Safe conversion handling cases where string cannot be parsed to number
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
      });
    } else {
      groupStage.count = { $sum: 1 };
    }
    
    pipeline.push({ $group: groupStage });
  }

  // Execute pipeline
  const results = await Dataset.aggregate(pipeline);

  // 3. Format result for Recharts
  // Flattening _id which contains the grouped dimensions
  const formattedResults = results.map(row => {
    const flatRow = { ...row._id, ...row };
    delete flatRow._id;
    return flatRow;
  });

  return formattedResults;
};

module.exports = { executeAggregation };
