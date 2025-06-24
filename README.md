# VeoPromptExporter

A specialized media automation tool for exporting and formatting video prompts for AI-powered video generation platforms.

## Overview

VeoPromptExporter provides a consistent interface for formatting, validating, and exporting prompts with proper metadata and annotations. It extracts structured prompt information from various source materials and enhances them using the Gemini API for optimal results across different AI platforms.

## Core Features

- Extract prompt data from source materials (scripts, storyboards, notes)
- Validate prompt structure and formatting against platform requirements
- Apply Gemini API for semantic enhancement and content validation
- Export formatted prompts to various platforms and file formats
- Maintain versioning and change history

## Getting Started

### Prerequisites

- Node.js 16+
- Firebase account (for authentication and storage)
- Google Cloud Platform account with Gemini API enabled
- Google Drive API credentials (for file storage integration)

### Installation

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

### Basic Usage

```javascript
const veoExporter = new VeoPromptExporter();
const result = await veoExporter.exportPrompt({
  sourceContent: "Create a cinematic urban scene with dramatic lighting, camera slowly panning right to reveal city skyline at sunset",
  targetPlatform: "midjourney",
  exportFormat: "json"
});
```

## Implementation Technologies

- JavaScript for core logic
- HTML5 for UI components
- Google Cloud Functions for serverless processing
- Firebase for authentication and storage
- Gemini API for semantic enhancement

## API Integrations

- Google Drive API for file access and storage
- Gemini API for language processing and enhancement
- Firebase Authentication and Firestore
- Google Cloud Storage for asset management

## Integration with Other Media Automation Tools

- SceneValidator: Use validated scene data as input for prompts
- StoryboardGen: Extract prompt data from generated storyboards
- TimelineAssembler: Apply prompts to timeline segments
- LoopOptimizer: Optimize prompts for looping content

## Documentation

Full documentation is available at [docs/index.md](docs/index.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
