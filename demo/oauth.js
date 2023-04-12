const express = require('express');
const app = express();

app.use('/', (req, res) => res.status(200).send('OAUTH response!'));

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
