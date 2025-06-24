/**
 * Prompt Parser Module
 * 
 * Extracts structured prompt information from unstructured text
 * Uses Gemini API to identify intent, subjects, styles, and parameters
 * Validates extracted information against platform requirements
 */

class PromptParser {
  /**
   * Creates a new PromptParser instance
   * @param {Object} config Configuration options
   */
  constructor(config = {}) {
    this.config = {
      debug: false,
      maxPromptLength: 1000,
      ...config
    };
  }
  
  /**
   * Parse source content into structured prompt data
   * @param {string} content Source content to parse
   * @param {string} sourceType Type of source content ('text', 'document', 'structured')
   * @returns {Promise<Object>} Structured prompt data
   */
  async parse(content, sourceType = 'text') {
    if (this.config.debug) {
      console.log(`Parsing content of type ${sourceType}`);
    }
    
    // Sanitize and normalize content
    const normalizedContent = this._normalizeContent(content);
    
    // Extract basic prompt components
    const components = this._extractComponents(normalizedContent);
    
    // Process based on source type
    let structuredData;
    switch (sourceType) {
      case 'document':
        structuredData = await this._parseDocument(normalizedContent, components);
        break;
      case 'structured':
        structuredData = await this._parseStructured(normalizedContent, components);
        break;
      case 'text':
      default:
        structuredData = await this._parseText(normalizedContent, components);
        break;
    }
    
    return {
      content: normalizedContent,
      metadata: structuredData,
      components
    };
  }
  
  /**
   * Normalize and sanitize content
   * @param {string} content Content to normalize
   * @returns {string} Normalized content
   * @private
   */
  _normalizeContent(content) {
    if (!content) {
      throw new Error('Content cannot be empty');
    }
    
    let normalized = content.trim();
    
    // Truncate if too long
    if (normalized.length > this.config.maxPromptLength) {
      normalized = normalized.substring(0, this.config.maxPromptLength);
    }
    
    // Basic sanitization
    normalized = normalized
      .replace(/[\n\r]+/g, ' ')
      .replace(/\s+/g, ' ');
    
    return normalized;
  }
  
  /**
   * Extract basic components from the prompt
   * @param {string} content Normalized content
   * @returns {Object} Extracted components
   * @private
   */
  _extractComponents(content) {
    // Simple extraction of potential components
    // In a real implementation, this would use NLP or Gemini API
    const subjects = [];
    const styles = [];
    const qualities = [];
    const settings = [];
    
    // Very basic extraction logic (would be much more sophisticated in production)
    const words = content.toLowerCase().split(/\s+/);
    
    // Check for common style keywords
    if (content.match(/cinematic|film noir|dramatic|realistic|stylized|anime/i)) {
      styles.push('cinematic');
    }
    
    // Check for quality indicators
    if (content.match(/detailed|high quality|8k|4k|hd/i)) {
      qualities.push('high quality');
    }
    
    // Check for common subjects
    if (content.match(/person|man|woman|character|detective|figure/i)) {
      subjects.push('character');
    }
    
    // Check for settings
    if (content.match(/urban|city|office|indoor|outdoor|landscape/i)) {
      settings.push('location');
    }
    
    return {
      subjects,
      styles,
      qualities,
      settings
    };
  }
  
  /**
   * Parse plain text content
   * @param {string} content Normalized content
   * @param {Object} components Extracted components
   * @returns {Promise<Object>} Structured data
   * @private
   */
  async _parseText(content, components) {
    // Basic metadata extraction
    // In a real implementation, this would use more sophisticated techniques
    return {
      type: 'text',
      subjects: components.subjects,
      styles: components.styles,
      qualities: components.qualities,
      settings: components.settings,
      parsedAt: new Date().toISOString()
    };
  }
  
  /**
   * Parse document content
   * @param {string} content Normalized content
   * @param {Object} components Extracted components
   * @returns {Promise<Object>} Structured data
   * @private
   */
  async _parseDocument(content, components) {
    // This would handle content from documents with more structure
    return {
      type: 'document',
      subjects: components.subjects,
      styles: components.styles,
      qualities: components.qualities,
      settings: components.settings,
      parsedAt: new Date().toISOString()
    };
  }
  
  /**
   * Parse structured content (e.g., JSON input)
   * @param {string} content Normalized content
   * @param {Object} components Extracted components
   * @returns {Promise<Object>} Structured data
   * @private
   */
  async _parseStructured(content, components) {
    // For structured content, we would parse the JSON or structured format
    let structuredData;
    try {
      // If the content is already JSON, parse it
      structuredData = JSON.parse(content);
    } catch (e) {
      // If not valid JSON, treat as text
      return this._parseText(content, components);
    }
    
    return {
      type: 'structured',
      structured: true,
      ...structuredData,
      parsedAt: new Date().toISOString()
    };
  }
}

module.exports = PromptParser;
