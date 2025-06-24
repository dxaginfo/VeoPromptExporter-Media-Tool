# VeoPromptExporter Documentation

## Introduction

VeoPromptExporter is a specialized media automation tool designed to export and format video prompts for various AI-powered video generation platforms. The tool provides a consistent interface for formatting, validating, and exporting prompts with proper metadata and annotations.

## Installation

```bash
# Clone the repository
git clone https://github.com/dxaginfo/VeoPromptExporter-Media-Tool.git
cd VeoPromptExporter-Media-Tool

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Run the development server
npm run dev
```

## Core Features

- Extract prompt data from source materials (scripts, storyboards, notes)
- Validate prompt structure and formatting against platform requirements
- Apply Gemini API for semantic enhancement and content validation
- Export formatted prompts to various platforms and file formats
- Maintain versioning and change history

## Usage

### Basic Usage

```javascript
const VeoPromptExporter = require('veopromptexporter');
const veoExporter = new VeoPromptExporter();

const result = await veoExporter.exportPrompt({
  sourceContent: "Create a cinematic urban scene with dramatic lighting, camera slowly panning right to reveal city skyline at sunset",
  targetPlatform: "midjourney",
  exportFormat: "json"
});

console.log(result);
```

### Batch Processing

```javascript
const result = await veoExporter.batchProcessFolder({
  folderId: "google_drive_folder_id",
  targetPlatform: "stable_diffusion",
  enhancementOptions: {
    useGemini: true,
    detailLevel: "detailed"
  }
});

console.log(result);
```

## API Reference

### Constructor Options

```javascript
const veoExporter = new VeoPromptExporter({
  debug: false, // Enable debug logging
  useGemini: true, // Use Gemini API for enhancement by default
  defaultPlatform: 'midjourney', // Default target platform
  defaultFormat: 'json' // Default export format
});
```

### Methods

#### `exportPrompt(options)`

Exports a single prompt based on the provided options.

**Parameters:**

- `options` (Object): Export options
  - `sourceContent` (String): The prompt content to export
  - `sourceType` (String, optional): Type of source content ('text', 'document', 'structured'). Default: 'text'
  - `targetPlatform` (String, optional): Target platform. Default: from constructor config
  - `exportFormat` (String, optional): Export format. Default: from constructor config
  - `enhancementOptions` (Object, optional): Enhancement options
    - `useGemini` (Boolean): Whether to use Gemini API. Default: from constructor config
    - `detailLevel` (String): Enhancement detail level ('basic', 'standard', 'detailed'). Default: 'standard'
    - `includeMetadata` (Boolean): Whether to include metadata. Default: true

**Returns:**

- Promise resolving to an object with export results

#### `batchProcessFolder(options)`

Processes a batch of prompts from a Google Drive folder.

**Parameters:**

- `options` (Object): Batch processing options
  - `folderId` (String): Google Drive folder ID
  - `targetPlatform` (String, optional): Target platform. Default: from constructor config
  - `enhancementOptions` (Object, optional): Enhancement options as in `exportPrompt`

**Returns:**

- Promise resolving to an object with batch processing results

#### `getSupportedPlatforms()`

Returns an array of supported platforms with their details.

#### `getSupportedFormats()`

Returns an array of supported export formats with their details.

## REST API Endpoints

### POST /api/export

Exports a single prompt or batch of prompts.

**Request Body:**

```json
{
  "sourceContent": "string or file reference",
  "sourceType": "text | document | structured",
  "targetPlatform": "string (platform identifier)",
  "exportFormat": "json | csv | txt | xml",
  "enhancementOptions": {
    "useGemini": true,
    "detailLevel": "basic | standard | detailed",
    "includeMetadata": true
  }
}
```

### POST /api/batch

Batch processes prompts from a Google Drive folder.

**Request Body:**

```json
{
  "folderId": "google_drive_folder_id",
  "targetPlatform": "string (platform identifier)",
  "enhancementOptions": {
    "useGemini": true,
    "detailLevel": "basic | standard | detailed"
  }
}
```

### GET /api/platforms

Returns list of supported export platforms.

### GET /api/formats

Returns list of supported export formats.

## Integration with Other Tools

VeoPromptExporter is designed to work with other media automation tools:

- **SceneValidator**: Use validated scene data as input for prompts
- **StoryboardGen**: Extract prompt data from generated storyboards
- **TimelineAssembler**: Apply prompts to timeline segments
- **LoopOptimizer**: Optimize prompts for looping content

## Advanced Customization

For advanced customization needs, you can extend the core classes:

- `PromptParser`: For custom parsing logic
- `FormatTransformer`: For custom format transformations
- `PromptValidator`: For custom validation rules
- `ExportEngine`: For custom export destinations

## Troubleshooting

### Common Issues

1. **Invalid prompt format**: Ensure source content follows expected structure
2. **Export failures**: Verify permissions for export destinations
3. **API rate limiting**: Implement exponential backoff for API calls
4. **Format incompatibilities**: Check platform-specific requirements

### Diagnostics

- Enable verbose logging with `debug: true` option
- Validate input independently before processing
- Check API response codes and error messages
- Verify network connectivity to required services

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
