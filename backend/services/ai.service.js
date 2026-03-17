const { GoogleGenAI } = require('@google/genai');

// Keep track of the current index for round-robin key rotation
let currentKeyIndex = 0;

const getApiKey = () => {
  const keysStr = process.env.GEMINI_API_KEY || '';
  const keys = keysStr.split(',').map(k => k.trim()).filter(k => k);
  
  if (keys.length === 0) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  
  // Simple round-robin approach to spread rate limits evenly
  const key = keys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  
  return key;
};

const generateChartConfig = async (prompt, columnsMetadata) => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const systemInstruction = `You are a data analyst assistant. Convert natural language queries into strict JSON configuration for a dashboard chart.
The available columns are: ${JSON.stringify(columnsMetadata)}.
You MUST ONLY use the exact column names provided in the available columns list.
If the user asks for a concept (like 'age') that doesn't exist, try to map it to the most relevant available column (like 'SeniorCitizen', 'tenure', etc.), or map it to the closest logical approximation. Do NOT invent or hallucinate new column names.

Return ONLY a valid JSON object matching this schema:
{
  "intent": "aggregation or filtering",
  "metrics": ["y-axis numeric columns (e.g. TotalCharges) or the special word 'Count'"],
  "dimensions": ["x-axis/category columns (e.g. gender)"],
  "filters": {"column": {"$operator": value} or "exact_value"},
  "chartType": "bar|line|pie|table|scatter"
}
Rules: 
- If the user asks for "how much", "how many", "count of", or "total number", ALWAYS use "Count" in the 'metrics' array.
- Use MongoDB operators in 'filters' if applicable (e.g., {"MonthlyCharges": {"$gt": 50}}).
- Use 'pie' for distributions (e.g., "proportion of...", "breakdown by...").
- Use 'line' for trends or time-series data.
- Use 'scatter' for correlations between two numeric metrics.
- Use 'bar' for categorical comparisons or simple counts.
- Only use 'table' if the user explicitly asks for a list or raw records.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Query: ${prompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const rawJson = response.text;
    let parsedObj;

    try {
      parsedObj = JSON.parse(rawJson);
    } catch (e) {
      throw new Error("LLM Hallucination: Returned invalid JSON string.");
    }

    // Default to empty arrays/objects if AI missed them to prevent frontend crashes
    return {
      intent: parsedObj.intent || 'aggregation',
      metrics: Array.isArray(parsedObj.metrics) ? parsedObj.metrics : [],
      dimensions: Array.isArray(parsedObj.dimensions) ? parsedObj.dimensions : [],
      filters: parsedObj.filters || {},
      chartType: parsedObj.chartType || 'table'
    };

  } catch (error) {
    console.error('AI Service Error:', error.message);
    throw new Error('Failed to generate chart config from prompt. ' + error.message);
  }
};

module.exports = { generateChartConfig };
