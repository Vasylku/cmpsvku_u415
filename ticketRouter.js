const express = require('express');
const { MongoClient } = require("mongodb");
const router = express.Router();
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const request = require('request');
const fs = require('fs');
const { parseString } = require('xml2js');
const js2xmlparser = require('js2xmlparser');
const xml2js = require("xml2js");
router.use(xmlparser());
// Read the tickets data from the file on startup
const ticketfile = './ticket.json';
let tickets = [];

function getLastTicketId() {
    if (tickets.length > 0) {
        const lastTicket = tickets[tickets.length - 1];
        const lastId = parseInt(lastTicket.id, 10);
        return lastId+1;
    }

    return 0;
}
class TicketAdapter {
    constructor(data) {
        this.data = data;
    }
    toJson() {
        if (typeof this.data === 'string') {
            return JSON.parse(this.data);
        } else if (typeof this.data === 'object') {
            return this.data;
        }
    }

    toXml() {
        if (typeof this.data === 'object') {
            return js2xmlparser.parse('ticket', this.data);
        } else if (typeof this.data === 'string') {
            return this.data;
        }
    }
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
router.get('/', async(req, res) => {
    res.send(tickets);
});

// Endpoint to get all tickets
router.get('/rest/list', (req, res) => {
   res.send(tickets);


});


// Endpoint to get a single ticket by id
router.get('/rest/ticket/:id', (req, res) => {
   // const client = new MongoClient(uri);
    const id = req.params.id;

    const ticket = tickets.find((t) => t.id === id);

    if (!ticket) {
        res.status(404).send('Ticket not found');
    } else {
        res.send(ticket);
    }
});
router.get('/rest/xml/ticket/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const response = await fetch(`https://kuservice.onrender.com/rest/ticket/${id}`);
        const ticketJson = await response.json();

     //   const ticketXml = js2xmlparser.parse('ticket', ticketJson);
        const ticketXml = new TicketAdapter(ticketJson).toXml();
        res.set('Content-Type', 'application/xml');
        res.send(ticketXml);
    } catch (error) {
        res.status(500).send('Error retrieving ticket');
    }
});
//Endpoint to update ticket json
router.put('/rest/ticket/:id', (req, res) => {
const id = req.params.id;
    const {
        type,
        subject,
        description,
        priority,
        status,
        creator,
        created_at,
    } = req.body;

    const ticketIndex = tickets.findIndex((t) => t.id === id);

    if (ticketIndex === -1) {
        res.status(404).send('Ticket not found');
    } else if (
        !type ||
        !subject ||
        !description ||
        !priority ||
        !status ||
        !creator ||
        !created_at
    ) {
        res.status(400).send('Incomplete ticket info');
    } else {
        const updatedTicket = {
            id,
            type,
            subject,
            description,
            priority,
            status,
            creator,
            created_at,
        };

        tickets[ticketIndex] = updatedTicket;

        // Write the updated tickets data to the file
        fs.writeFile(ticketfile, JSON.stringify(tickets), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to file');
            } else {
                res.send(updatedTicket);
            }
        });
    }

})// Endpoint to add a single ticket sent as an XML document
router.put('/rest/xml/ticket/:id', (req, res) => {
    const id = req.params.id;
    const xmlData = req.body;
    let obj = {};
    for(let a in xmlData.ticket){

        obj[a] = xmlData.ticket[a][0];
    }
    // Convert XML data to JSON
   const jsonData = JSON.stringify(obj);

    // Make PUT request using request library
    const options = {
        method: 'PUT',
        url: `http://localhost:3000/rest/ticket/${id}`,
        headers: { 'Content-Type': 'application/json' },
        body: jsonData,
    };

    request(options, (error, response, body) => {
        if (error) {
            res.status(500).send('Error updating ticket');
        } else {
            // Convert response body back to XML format
           // const xmlResponse = js2xmlparser.parse('ticket', body);
            const xmlResponse = new TicketAdapter(body).toXml();
            res.set('Content-Type', 'application/xml');
            res.send(xmlResponse);
        }
    });
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
    } = req.body;

    if (!type || !subject || !description || !priority || !status || !creator || !created_at ) {
        res.status(400).send('Incomplete ticket info');
    } else {
        const lastId = getLastTicketId();
        const newTicket = {
            id: lastId.toString(),
            type,
            subject,
            description,
            priority,
            status,
            creator,
            created_at,
        };
        tickets.push(newTicket);

        // Write the updated tickets data to the file
        fs.writeFile(ticketfile, JSON.stringify(tickets), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to file');
            } else {

                res.send(newTicket);
            }
        });
    }
});
// Endpoint to delete a ticket by id
router.delete('/rest/ticket/:id', (req, res) => {
    const id = req.params.id;
    const ticketIndex = tickets.findIndex((t) => t.id === id);

    if (ticketIndex === -1) {
        res.status(404).send('Ticket not found');
    } else {
        tickets.splice(ticketIndex, 1);

        // Write the updated tickets data to the file
        fs.writeFile(ticketfile, JSON.stringify(tickets), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to file');
            } else {
                res.send('Ticket deleted');
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






