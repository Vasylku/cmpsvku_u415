const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

// Read the tickets data from the file on startup
const ticketfile = './ticket.json';
let tickets = [];
function getLastTicketId() {
    if (tickets.length > 0) {
        const lastTicket = tickets[tickets.length - 1];
        const lastId = parseInt(lastTicket.id, 10);
        if (!isNaN(lastId)) {
            return lastId;
        }
    }
    return 0;
}
fs.readFile(ticketfile, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        tickets = JSON.parse(data);
    }
});

// Middleware
router.use(bodyParser.json());
router.use(express.static('pages'));
router.use(express.static('./'));

// Default endpoint
router.get('/', (req, res) => {
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
        const lastId = getLastTicketId();
        const newTicket = {
            id: lastId + 1,
            type,
            subject,
            description,
            priority,
            status,
            creator,
            created_at,
            updated_at,
        };


        // Write the updated tickets data to the file
        fs.writeFile(ticketfile, JSON.stringify(tickets), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to file');
            } else {
                tickets.push(newTicket);
                res.send(newTicket);
            }
        });
    }
});

// Error handling middleware for bad requests
router.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400).send('Bad request');
    } else {
        next();
    }
});

// Error handling middleware for no data to send back
router.use((req, res, next) => {
    if (res.statusCode === 200 && !res.headersSent) {
        res.status(404).send('No data to send back');
    } else {
        next();
    }
});

module.exports = router;






/*
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const tickets = require('./ticket.json');
const fs = require('fs');

// Read the tickets data from the file on startup
const ticketfile = './ticket.json';
let file = [];
function getLastTicketId() {
    if (tickets.length > 0) {
        return tickets[tickets.length - 1].id;
    } else {
        return 0;
    }
}
fs.readFile(ticketfile, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        file = JSON.parse(data);
    }
});
router.use(bodyParser.json());
router.use(express.static('pages'));
router.use(express.static('./'));
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
        const lastId = getLastTicketId();
        const newTicket = {
            id: lastId + 1,
            type,
            subject,
            description,
            priority,
            status,
            creator,
            created_at,
            updated_at,
        };
     //   tickets.push(newTicket);
     //   res.send(newTicket);
        // Write the updated tickets data to the file
        fs.writeFile(ticketfile, JSON.stringify(file), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to file');
            } else {
                res.send(newTicket);
            }
        });
    }
});
// Error handling middleware for bad requests
router.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400).send('Bad request');
    } else {
        next();
    }
});

// Error handling middleware for no data to send back
router.use((req, res, next) => {
    if (res.statusCode === 200 && !res.headersSent) {
        res.status(404).send('No data to send back');
    } else {
        next();
    }
});

module.exports = router;
*/
