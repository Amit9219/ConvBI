const { GoogleGenAI } = require('@google/genai');

// Keep track of the current index for round-robin key rotation
let currentKeyIndex = 0;

const getApiKey = () => {
  const keysStr = process.env.GEMINI_API_KEY || '';
  const keys = [...new Set(keysStr.split(',').map(k => k.trim()).filter(k => k))];
  
  if (keys.length === 0) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  
  // Randomize key selection to spread rate limits evenly, 
  // especially for short-lived processes where index-based rotation resets.
  return keys[Math.floor(Math.random() * keys.length)];
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
  "groups": [{"label": "String", "filter": {"column": {"$operator": value}}} or "rest"],
  "chartType": "bar|line|pie|table|scatter"
}
Rules: 
- Use 'metrics' and 'dimensions' for standard aggregations.
- If the user asks for "how much", "how many", "count of", or "total number", ALWAYS use "Count" in the 'metrics' array.
- If asked to "compare" a filtered group with the 'rest' or 'others', use the 'groups' field. Define one group with the specific filter and another with "rest".
- Do NOT use 'dimensions' when using 'groups' for comparison.
- Use MongoDB operators in 'filters' if applicable (e.g., {"MonthlyCharges": {"$gt": 50}}).
- Use 'pie' for distributions, 'line' for trends, 'scatter' for correlations, and 'bar' for categorical comparisons.
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
      groups: Array.isArray(parsedObj.groups) ? parsedObj.groups : [],
      chartType: parsedObj.chartType || 'table'
    };

  } catch (error) {
    console.error('AI Service Error:', error.message || error);
    
    const errorMessage = typeof error.message === 'string' ? error.message : JSON.stringify(error);
    if (errorMessage.includes('429') || errorMessage.includes('ResourceExhausted') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('GEMINI_QUOTA_EXCEEDED');
    }
    
    throw new Error('Failed to generate chart config from prompt. ' + error.message);
  }
};

module.exports = { generateChartConfig };
