const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configure the proxy middleware
app.use('/api', createProxyMiddleware({
  target: 'https://platform.fintacharts.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  },
  onProxyRes: function(proxyRes, req, res) {
    // Allow CORS
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
  }
}));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
});
