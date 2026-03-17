const Query = require('../models/Query');
const Dataset = require('../models/Dataset');
const { generateChartConfig } = require('../services/ai.service');
const { executeAggregation } = require('../services/query.service');

const processQuery = async (req, res) => {
  const { datasetId, prompt } = req.body;
  if (!datasetId || !prompt) {
    return res.status(400).json({ message: 'Dataset ID and prompt are required' });
  }

  try {
    const dataset = await Dataset.findById(datasetId).select('columns');
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // 1. Gen config from LLM
    let chartConfig;
    try {
      chartConfig = await generateChartConfig(prompt, dataset.columns);
    } catch (aiError) {
      if (aiError.message === 'GEMINI_QUOTA_EXCEEDED') {
        return res.status(429).json({ message: 'The ConvBI AI Query limit has been reached for the free tier. Please wait a minute and try again.' });
      }
      // Contextually handling hallucination or errors
      return res.status(400).json({ message: 'AI failed to understand prompt.', details: aiError.message });
    }

    // 2. Execute DB Aggregation
    const resultData = await executeAggregation(datasetId, chartConfig);

    // 3. Save to Query History
    const queryDoc = await Query.create({
      user: req.user.id,
      dataset: datasetId,
      prompt,
      chartConfig,
      resultData
    });

    // 4. Return result matching Recharts needs
    res.status(200).json({
      queryId: queryDoc._id,
      chartConfig,
      data: resultData
    });
  } catch (error) {
    console.error('Query processing error', error);
    res.status(500).json({ message: error.message });
  }
};

const getQueryHistory = async (req, res) => {
  try {
    // Limit history to last 10 queries to avoid massive payloads
    // Use .lean() for faster, memory-efficient reads
    const queries = await Query.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { processQuery, getQueryHistory };
