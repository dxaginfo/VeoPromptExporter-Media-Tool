/**
 * VeoPromptExporter API Server
 * 
 * This file provides a simple Express server for the VeoPromptExporter tool,
 * exposing REST API endpoints for prompt exporting and processing.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const VeoPromptExporter = require('./src/index');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the VeoPromptExporter
const veoExporter = new VeoPromptExporter({
  debug: process.env.NODE_ENV !== 'production',
  useGemini: true,
  defaultPlatform: 'midjourney',
  defaultFormat: 'json'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/ui')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/ui/index.html'));
});

// API Endpoints
app.post('/api/export', async (req, res) => {
  try {
    const options = req.body;
    const result = await veoExporter.exportPrompt(options);
    res.json(result);
  } catch (error) {
    console.error('Export error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/batch', async (req, res) => {
  try {
    const options = req.body;
    const result = await veoExporter.batchProcessFolder(options);
    res.json(result);
  } catch (error) {
    console.error('Batch processing error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/platforms', (req, res) => {
  try {
    const platforms = veoExporter.getSupportedPlatforms();
    res.json({ platforms });
  } catch (error) {
    console.error('Error getting platforms:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/formats', (req, res) => {
  try {
    const formats = veoExporter.getSupportedFormats();
    res.json({ formats });
  } catch (error) {
    console.error('Error getting formats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`VeoPromptExporter server running on port ${PORT}`);
});
