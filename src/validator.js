/**
 * Prompt Validator Module
 * 
 * Validates prompts against platform-specific requirements
 * Checks for required elements, forbidden content, and format issues
 * Provides clear error messages and warnings
 */

class PromptValidator {
  /**
   * Creates a new PromptValidator instance
   * @param {Object} config Configuration options
   */
  constructor(config = {}) {
    this.config = {
      debug: false,
      strictValidation: false,
      ...config
    };
    
    // Platform-specific validation rules
    this.validationRules = {
      midjourney: {
        maxLength: 500,
        maxParameters: 10,
        forbiddenPhrases: ['nsfw', 'nude', 'explicit', 'gore', 'disturbing'],
        recommendedFormat: 'subject, style, setting, quality parameters',
        parameterRules: {
          ar: { format: /^\d+:\d+$/, examples: ['16:9', '4:3', '1:1'] },
          stylize: { format: /^\d+$/, range: [0, 1000] },
          quality: { format: /^\d+$/, range: [0.25, 5] }
        }
      },
      stable_diffusion: {
        maxLength: 1000,
        forbiddenPhrases: ['nsfw', 'nude', 'explicit', 'gore', 'disturbing'],
        recommendedFormat: 'detailed description with weights using () or []',
        parameterRules: {
          steps: { format: /^\d+$/, range: [20, 150] },
          cfg: { format: /^\d+(\.\d+)?$/, range: [1, 30] },
          sampler: { validValues: ['Euler a', 'DPM++ 2M Karras', 'DDIM'] }
        }
      },
      dall_e: {
        maxLength: 1000,
        forbiddenPhrases: ['nsfw', 'nude', 'explicit', 'gore', 'disturbing', 'political', 'celebrity'],
        recommendedFormat: 'detailed description, clear style references',
        requirements: ['clear subject', 'specific style']
      },
      runway: {
        maxLength: 800,
        forbiddenPhrases: ['nsfw', 'nude', 'explicit', 'gore', 'disturbing'],
        recommendedFormat: 'descriptive text with visual details',
        parameterRules: {
          guidance: { format: /^\d+(\.\d+)?$/, range: [1, 50] }
        }
      },
      custom: {
        maxLength: 2000,
        forbiddenPhrases: [],
        recommendedFormat: 'any format acceptable'
      }
    };
  }
  
  /**
   * Validate a prompt against platform requirements
   * @param {Object} prompt The prompt to validate
   * @param {string} platform Target platform
   * @returns {Object} Validation result with status and messages
   */
  validate(prompt, platform) {
    if (this.config.debug) {
      console.log(`Validating prompt for ${platform}`);
    }
    
    // Get platform-specific rules
    const rules = this.validationRules[platform] || this.validationRules.custom;
    
    // Initialize validation result
    const result = {
      status: 'valid',
      message: `Prompt successfully validated for ${platform}`,
      warnings: [],
      errors: []
    };
    
    // Check length constraints
    if (prompt.content && prompt.content.length > rules.maxLength) {
      result.warnings.push(`Prompt exceeds maximum length of ${rules.maxLength} characters`);
      result.status = 'warning';
    }
    
    // Check for forbidden content
    if (prompt.content && rules.forbiddenPhrases && rules.forbiddenPhrases.length) {
      const lowerContent = prompt.content.toLowerCase();
      
      for (const phrase of rules.forbiddenPhrases) {
        if (lowerContent.includes(phrase.toLowerCase())) {
          result.errors.push(`Prompt contains forbidden content: "${phrase}"`);
          result.status = 'error';
        }
      }
    }
    
    // Check required elements (if any)
    if (rules.requirements && rules.requirements.length) {
      for (const requirement of rules.requirements) {
        // This is a simplified check - a real implementation would be more sophisticated
        if (!prompt.content.toLowerCase().includes(requirement.toLowerCase())) {
          result.warnings.push(`Prompt may be missing required element: "${requirement}"`);
          if (result.status === 'valid') {
            result.status = 'warning';
          }
        }
      }
    }
    
    // Check parameter rules if present in prompt
    if (rules.parameterRules && prompt.content.includes(':')) {
      const paramMatches = prompt.content.match(/\b([a-z0-9_]+):(\S+)/gi);
      
      if (paramMatches) {
        for (const match of paramMatches) {
          const [param, value] = match.split(':');
          const paramName = param.toLowerCase();
          
          if (rules.parameterRules[paramName]) {
            const paramRule = rules.parameterRules[paramName];
            
            // Check format
            if (paramRule.format && !paramRule.format.test(value)) {
              result.warnings.push(`Parameter "${paramName}" has invalid format. Expected format: ${paramRule.format}`);
              if (result.status === 'valid') {
                result.status = 'warning';
              }
            }
            
            // Check range
            if (paramRule.range) {
              const numValue = parseFloat(value);
              if (isNaN(numValue) || numValue < paramRule.range[0] || numValue > paramRule.range[1]) {
                result.warnings.push(`Parameter "${paramName}" is out of range. Expected range: ${paramRule.range[0]} to ${paramRule.range[1]}`);
                if (result.status === 'valid') {
                  result.status = 'warning';
                }
              }
            }
            
            // Check valid values
            if (paramRule.validValues && !paramRule.validValues.includes(value)) {
              result.warnings.push(`Parameter "${paramName}" has invalid value. Valid values: ${paramRule.validValues.join(', ')}`);
              if (result.status === 'valid') {
                result.status = 'warning';
              }
            }
          }
        }
      }
    }
    
    // Update final message based on status
    if (result.status === 'warning') {
      result.message = `Prompt validated with ${result.warnings.length} warnings for ${platform}`;
    } else if (result.status === 'error') {
      result.message = `Prompt validation failed with ${result.errors.length} errors for ${platform}`;
    }
    
    return result;
  }
  
  /**
   * Get validation rules for a specific platform
   * @param {string} platform Platform name
   * @returns {Object} Validation rules for the platform
   */
  getRulesForPlatform(platform) {
    return this.validationRules[platform] || this.validationRules.custom;
  }
  
  /**
   * Get formatting recommendations for a specific platform
   * @param {string} platform Platform name
   * @returns {string} Formatting recommendations
   */
  getRecommendations(platform) {
    const rules = this.validationRules[platform] || this.validationRules.custom;
    return rules.recommendedFormat || 'No specific format recommendations available';
  }
}

module.exports = PromptValidator;
