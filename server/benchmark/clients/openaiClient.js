const LLMClient = require('./baseClient');

class OpenAIClient extends LLMClient {
    constructor(apiKey, modelName = 'gpt-4o') {
        super(apiKey);
        this.modelName = modelName;
    }

    async analyze(documentText, systemPrompt) {
        const prompt = this.formatPrompt(documentText, systemPrompt);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.modelName,
                    messages: [
                        { role: 'system', content: prompt.system },
                        { role: 'user', content: prompt.user }
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.1
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(`OpenAI API Error: ${data.error.message}`);
            }
            return this.parseResponse(data.choices[0].message.content);
        } catch (error) {
            console.error('OpenAI Analysis Failed:', error);
            throw error;
        }
    }
}

module.exports = OpenAIClient;
