const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const tickets = require('./ticket.json');

server.use(bodyParser.json());

// Create some initial tickets


// Endpoint to get all tickets
server.get('/rest/list', (req, res) => {
    res.send(tickets);
});

// Endpoint to get a single ticket by id
server.get('/rest/ticket/:id', (req, res) => {
    const id = req.params.id;
    const ticket = tickets.find((t) => t.id === id);

    if (!ticket) {
        res.status(404).send('Ticket not found');
    } else {
        res.send(ticket);
    }
});

// Endpoint to create a new ticket
server.post('/rest/ticket', (req, res) => {
    const {
        type,
        subject,
        description,
        priority,
        status,
        creator,
        created_at,
        updated_at,
    } = req.body;

    if (!type || !subject || !description || !priority || !status || !creator || !created_at || !updated_at) {
        res.status(400).send('Incomplete ticket info');
    } else {
        const newTicket = new tickets(Date.now().toString(), type, subject, description, priority, status, creator, created_at, updated_at);
        tickets.push(newTicket);
        res.send(newTicket);
    }
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});