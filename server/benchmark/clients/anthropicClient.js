const LLMClient = require('./baseClient');

class AnthropicClient extends LLMClient {
    constructor(apiKey, modelName = 'claude-3-5-sonnet-20240620') {
        super(apiKey);
        this.modelName = modelName;
    }

    async analyze(documentText, systemPrompt) {
        const prompt = this.formatPrompt(documentText, systemPrompt);

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.modelName,
                    max_tokens: 4096,
                    messages: [
                        { role: 'user', content: `${prompt.system}\n\n${prompt.user}` }
                    ],
                    temperature: 0.1
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(`Anthropic API Error: ${data.error.message}`);
            }
            return this.parseResponse(data.content[0].text);
        } catch (error) {
            console.error('Anthropic Analysis Failed:', error);
            throw error;
        }
    }
}

module.exports = AnthropicClient;
