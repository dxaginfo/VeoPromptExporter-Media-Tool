/**
 * Format Transformer Module
 * 
 * Converts between prompt formats for different platforms
 * Maintains structural integrity and semantic meaning
 * Handles special characters and platform-specific syntax
 */

class FormatTransformer {
  /**
   * Creates a new FormatTransformer instance
   * @param {Object} config Configuration options
   */
  constructor(config = {}) {
    this.config = {
      debug: false,
      ...config
    };
    
    // Platform-specific formatting rules
    this.platformRules = {
      midjourney: {
        maxLength: 500,
        parameterSeparator: ',',
        weightOperator: '::',
        supportsTags: true,
        supportsWeights: true,
        imageRatio: '1:1, 16:9, 4:3, 3:2',
        commonParameters: ['ar', 'stylize', 'quality', 'chaos']
      },
      stable_diffusion: {
        maxLength: 1000,
        parameterSeparator: ',',
        weightOperator: ':',
        supportsTags: true,
        supportsWeights: true,
        bracketTypes: ['()', '[]', '{}'],
        negativePromptMarker: 'Negative:'
      },
      dall_e: {
        maxLength: 1000,
        parameterSeparator: ',',
        supportsTags: false,
        supportsWeights: false
      },
      runway: {
        maxLength: 800,
        parameterSeparator: ',',
        supportsTags: true,
        supportsWeights: false
      },
      custom: {
        maxLength: 2000,
        parameterSeparator: ',',
        weightOperator: '::',
        supportsTags: true,
        supportsWeights: true
      }
    };
    
    // Format-specific rules
    this.formatRules = {
      json: {
        indent: 2,
        includeMetadata: true
      },
      txt: {
        lineSeparator: '\n',
        includeMetadata: false
      },
      csv: {
        delimiter: ',',
        includeHeader: true,
        quoteStrings: true
      },
      xml: {
        rootElement: 'prompt',
        indent: 2
      }
    };
  }
  
  /**
   * Transform a prompt for a specific platform and output format
   * @param {Object} prompt The prompt to transform
   * @param {string} platform Target platform
   * @param {string} format Output format
   * @returns {Object} Transformed prompt
   */
  transform(prompt, platform, format) {
    if (this.config.debug) {
      console.log(`Transforming prompt for ${platform} in ${format} format`);
    }
    
    // Get platform-specific rules
    const platformConfig = this.platformRules[platform] || this.platformRules.custom;
    
    // Apply platform-specific transformations
    const platformPrompt = this._applyPlatformRules(prompt, platformConfig);
    
    // Format the output according to the requested format
    const formattedPrompt = this._formatOutput(platformPrompt, format);
    
    return formattedPrompt;
  }
  
  /**
   * Apply platform-specific rules to a prompt
   * @param {Object} prompt The prompt to transform
   * @param {Object} rules Platform-specific rules
   * @returns {Object} Platform-optimized prompt
   * @private
   */
  _applyPlatformRules(prompt, rules) {
    let content = prompt.content;
    const metadata = prompt.metadata || {};
    
    // Truncate if needed
    if (content.length > rules.maxLength) {
      content = content.substring(0, rules.maxLength);
    }
    
    // Apply platform-specific formatting
    if (rules.supportsTags && metadata.styles && metadata.styles.length) {
      // Add style tags with appropriate syntax
      const styleTags = metadata.styles.join(rules.parameterSeparator + ' ');
      content = `${content}${rules.parameterSeparator} ${styleTags}`;
    }
    
    // Add quality indicators if supported
    if (metadata.qualities && metadata.qualities.length) {
      const qualities = metadata.qualities.join(rules.parameterSeparator + ' ');
      content = `${content}${rules.parameterSeparator} ${qualities}`;
    }
    
    return {
      content,
      metadata,
      platform: rules
    };
  }
  
  /**
   * Format the output according to the requested format
   * @param {Object} platformPrompt Platform-optimized prompt
   * @param {string} format Output format
   * @returns {Object} Formatted prompt
   * @private
   */
  _formatOutput(platformPrompt, format) {
    const formatConfig = this.formatRules[format] || {};
    let output;
    
    switch (format) {
      case 'json':
        output = this._formatJson(platformPrompt, formatConfig);
        break;
      case 'txt':
        output = this._formatTxt(platformPrompt, formatConfig);
        break;
      case 'csv':
        output = this._formatCsv(platformPrompt, formatConfig);
        break;
      case 'xml':
        output = this._formatXml(platformPrompt, formatConfig);
        break;
      default:
        output = this._formatJson(platformPrompt, formatConfig);
    }
    
    return {
      ...platformPrompt,
      formatted: output,
      format
    };
  }
  
  /**
   * Format prompt as JSON
   * @param {Object} prompt Platform-optimized prompt
   * @param {Object} config Format configuration
   * @returns {string} JSON-formatted prompt
   * @private
   */
  _formatJson(prompt, config) {
    const jsonObj = {
      prompt: prompt.content,
      timestamp: new Date().toISOString()
    };
    
    if (config.includeMetadata && prompt.metadata) {
      jsonObj.metadata = prompt.metadata;
    }
    
    return JSON.stringify(jsonObj, null, config.indent || 0);
  }
  
  /**
   * Format prompt as plain text
   * @param {Object} prompt Platform-optimized prompt
   * @param {Object} config Format configuration
   * @returns {string} Text-formatted prompt
   * @private
   */
  _formatTxt(prompt, config) {
    let txt = prompt.content;
    
    if (config.includeMetadata && prompt.metadata) {
      txt += config.lineSeparator + config.lineSeparator;
      txt += 'Metadata:' + config.lineSeparator;
      
      Object.entries(prompt.metadata).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          txt += `${key}: ${value.join(', ')}${config.lineSeparator}`;
        } else if (typeof value === 'object') {
          txt += `${key}: ${JSON.stringify(value)}${config.lineSeparator}`;
        } else {
          txt += `${key}: ${value}${config.lineSeparator}`;
        }
      });
    }
    
    return txt;
  }
  
  /**
   * Format prompt as CSV
   * @param {Object} prompt Platform-optimized prompt
   * @param {Object} config Format configuration
   * @returns {string} CSV-formatted prompt
   * @private
   */
  _formatCsv(prompt, config) {
    const delimiter = config.delimiter || ',';
    const quote = config.quoteStrings ? '"' : '';
    
    let csv = '';
    
    // Add header if requested
    if (config.includeHeader) {
      csv += `prompt${delimiter}timestamp`;
      
      if (prompt.metadata) {
        Object.keys(prompt.metadata).forEach(key => {
          csv += `${delimiter}${key}`;
        });
      }
      
      csv += '\n';
    }
    
    // Add content row
    csv += `${quote}${prompt.content}${quote}${delimiter}${quote}${new Date().toISOString()}${quote}`;
    
    // Add metadata if available
    if (prompt.metadata) {
      Object.values(prompt.metadata).forEach(value => {
        let cellValue;
        
        if (Array.isArray(value)) {
          cellValue = value.join('; ');
        } else if (typeof value === 'object') {
          cellValue = JSON.stringify(value);
        } else {
          cellValue = value;
        }
        
        csv += `${delimiter}${quote}${cellValue}${quote}`;
      });
    }
    
    return csv;
  }
  
  /**
   * Format prompt as XML
   * @param {Object} prompt Platform-optimized prompt
   * @param {Object} config Format configuration
   * @returns {string} XML-formatted prompt
   * @private
   */
  _formatXml(prompt, config) {
    const rootElement = config.rootElement || 'prompt';
    const indent = ' '.repeat(config.indent || 2);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<${rootElement}>\n`;
    xml += `${indent}<content><![CDATA[${prompt.content}]]></content>\n`;
    xml += `${indent}<timestamp>${new Date().toISOString()}</timestamp>\n`;
    
    // Add metadata if available
    if (prompt.metadata) {
      xml += `${indent}<metadata>\n`;
      
      Object.entries(prompt.metadata).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          xml += `${indent}${indent}<${key}>\n`;
          value.forEach(item => {
            xml += `${indent}${indent}${indent}<item>${item}</item>\n`;
          });
          xml += `${indent}${indent}</${key}>\n`;
        } else if (typeof value === 'object') {
          xml += `${indent}${indent}<${key}><![CDATA[${JSON.stringify(value)}]]></${key}>\n`;
        } else {
          xml += `${indent}${indent}<${key}>${value}</${key}>\n`;
        }
      });
      
      xml += `${indent}</metadata>\n`;
    }
    
    xml += `</${rootElement}>`;
    
    return xml;
  }
}

module.exports = FormatTransformer;
