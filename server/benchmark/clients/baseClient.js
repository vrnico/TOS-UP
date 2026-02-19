class LLMClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async analyze(documentText, systemPrompt) {
    throw new Error('Analyze method not implemented');
  }

  formatPrompt(documentText, systemPrompt) {
    return {
      system: systemPrompt,
      user: `Analyze the following Terms of Service document based on the provided rubric. Output strictly in JSON format.\n\nDOCUMENT:\n${documentText}`
    };
  }

  parseResponse(response) {
    try {
      // Find JSON block if it's wrapped in markdown
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (e) {
      console.error('Failed to parse model response as JSON:', e);
      return null;
    }
  }
}

module.exports = LLMClient;
