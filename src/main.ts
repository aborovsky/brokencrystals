# src/main.ts modifications
# Ensure the health check endpoint is exposed
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});