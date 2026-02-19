const fs = require('fs');
const path = require('path');
const GroqClient = require('./clients/groqClient');
const AnthropicClient = require('./clients/anthropicClient');
const OpenAIClient = require('./clients/openaiClient');
const GeminiClient = require('./clients/geminiClient');

const DOCS_DIR = path.join(__dirname, '../../docs');
const OUTPUT_DIR = path.join(__dirname, '../../benchmark-results');
const RUBRIC_PATH = path.join(__dirname, '../../scoring-rubric.md');

// Load environment variables (simulated for now, would use dotenv)
const CONFIG = {
    groq: process.env.GROQ_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    gemini: process.env.GEMINI_API_KEY
};

async function runBenchmark() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const rubric = fs.readFileSync(RUBRIC_PATH, 'utf8');
    const systemPrompt = `You are an expert legal analyst. Analyze the following Terms of Service document based on the CATEGORIES and CRITERIA below. 

${rubric}

ADDITIONAL INSTRUCTIONS:
1. Novel Problem Detection: Actively look for unusual, invasive, or non-standard clauses that may not be explicitly covered by the categories.
2. Output Format: You MUST output strictly in JSON format matching the following schema:
{
  "platform": "String",
  "model": "String",
  "categories": {
    "[category_name]": {
      "score": 1-5 or null,
      "gap_flag": boolean,
      "gap_note": "String explaining the gap",
      "evidence": "Direct quote from the document",
      "analysis": "Brief reasoning for the score"
    }
  },
  "novel_findings": [
    {
      "title": "String",
      "description": "String",
      "severity": "low|medium|high|critical",
      "evidence": "String"
    }
  ],
  "overall_summary": "String"
}
`;

    const clients = {
        'groq-llama3-70b': new GroqClient(CONFIG.groq),
        'openai-gpt-4o': new OpenAIClient(CONFIG.openai),
        'anthropic-claude-3-5-sonnet': new AnthropicClient(CONFIG.anthropic),
        'gemini-1.5-pro': new GeminiClient(CONFIG.gemini)
    };

    const docFiles = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.md'));

    for (const docFile of docFiles) {
        const platform = docFile.replace('.md', '');
        const docText = fs.readFileSync(path.join(DOCS_DIR, docFile), 'utf8');

        for (const [modelId, client] of Object.entries(clients)) {
            if (!client.apiKey) {
                console.log(`Skipping ${modelId} - No API Key found.`);
                continue;
            }

            console.log(`[${platform}] Analyzing with ${modelId}...`);

            const modelOutputDir = path.join(OUTPUT_DIR, modelId);
            if (!fs.existsSync(modelOutputDir)) fs.mkdirSync(modelOutputDir, { recursive: true });

            const outputPath = path.join(modelOutputDir, `${platform}.json`);
            if (fs.existsSync(outputPath)) {
                console.log(`Skipping ${modelId}/${platform} - Result already exists.`);
                continue;
            }

            try {
                const result = await client.analyze(docText, systemPrompt);
                if (result) {
                    result.platform = platform;
                    result.model = modelId;
                    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
                    console.log(`[${platform}] ${modelId} - SUCCESS`);
                }
            } catch (err) {
                console.error(`[${platform}] ${modelId} - FAILED:`, err.message);
            }

            // Basic rate limiting delay
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    console.log('\nBenchmark Complete!');
}

runBenchmark().catch(console.error);
