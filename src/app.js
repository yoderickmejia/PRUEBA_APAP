const express = require('express');

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Main endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Prueba Técnica APAP',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.status(200).json({
    app: 'prueba-tecnica-apap',
    description: 'API de prueba técnica para posición DevOps Middle - APAP',
    endpoints: [
      { method: 'GET', path: '/', description: 'Mensaje principal' },
      { method: 'GET', path: '/health', description: 'Health check' },
      { method: 'GET', path: '/api/info', description: 'Información de la API' }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
