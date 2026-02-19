const LLMClient = require('./baseClient');

class GeminiClient extends LLMClient {
    constructor(apiKey, modelName = 'gemini-1.5-pro') {
        super(apiKey);
        this.modelName = modelName;
    }

    async analyze(documentText, systemPrompt) {
        const prompt = this.formatPrompt(documentText, systemPrompt);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `${prompt.system}\n\n${prompt.user}` }]
                    }],
                    generationConfig: {
                        response_mime_type: 'application/json',
                        temperature: 0.1
                    }
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(`Gemini API Error: ${data.error.message}`);
            }
            return this.parseResponse(data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error('Gemini Analysis Failed:', error);
            throw error;
        }
    }
}

module.exports = GeminiClient;
