const express = require('express');
const app = express();
const ticketRouter = require('./ticketRouter');

app.use(ticketRouter);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});