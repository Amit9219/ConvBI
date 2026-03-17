const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');

// Ensure GEMINI_API_KEY is available in process.env
// The SDK will automatically pick it up, or we can instantiate manually.

const generateChartConfig = async (prompt, columnsMetadata) => {
  try {
    const ai = new GoogleGenAI({});

    const schema = z.object({
      intent: z.string(),
      metrics: z.array(z.string()).optional().default([]),
      dimensions: z.array(z.string()).optional().default([]),
      filters: z.record(z.any()).optional(),
      chartType: z.enum(['bar', 'line', 'pie', 'table', 'scatter']),
    });

    const systemInstruction = `You are a data analyst assistant. Convert natural language queries into strict JSON configuration for a dashboard chart.
The available columns are: ${JSON.stringify(columnsMetadata)}.
You MUST ONLY use the exact column names provided in the available columns list.
If the user asks for a concept (like 'age') that doesn't exist, try to map it to the most relevant available column (like 'SeniorCitizen', 'tenure', etc.), or map it to the closest logical approximation. Do NOT invent or hallucinate new column names.

Return ONLY a valid JSON object matching this schema:
{
  "intent": "aggregation or filtering",
  "metrics": ["y-axis columns (e.g. sales)"],
  "dimensions": ["x-axis/category columns (e.g. region)"],
  "filters": {"column": "value_to_filter"},
  "chartType": "bar|line|pie|table|scatter"
}
Rules: Time data -> line, Categories -> bar, Distribution -> pie. Default to 'table' if just asking for data.`;

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

    const validatedResult = schema.parse(parsedObj);
    return validatedResult;

  } catch (error) {
    console.error('AI Service Error:', error.message);
    throw new Error('Failed to generate chart config from prompt. ' + error.message);
  }
};

module.exports = { generateChartConfig };
