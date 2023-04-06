const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const tickets = require('./ticket.json');

router.use(bodyParser.json());
router.use(express.static('pages'));
//Default
router.get('/', (req, res) =>{


    res.send(tickets);
});

// Endpoint to get all tickets
router.get('/rest/list', (req, res) => {
    res.send(tickets);

});

// Endpoint to get a single ticket by id
router.get('/rest/ticket/:id', (req, res) => {
    const id = req.params.id;
    const ticket = tickets.find((t) => t.id === id);

    if (!ticket) {
        res.status(404).send('Ticket not found');
    } else {
        res.send(ticket);
    }
});

// Endpoint to create a new ticket
router.post('/rest/ticket', (req, res) => {
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
        const newTicket = {
            id: Date.now().toString(),
            type,
            subject,
            description,
            priority,
            status,
            creator,
            created_at,
            updated_at,
        };
        tickets.push(newTicket);
        res.send(newTicket);
    }
});

module.exports = router;
