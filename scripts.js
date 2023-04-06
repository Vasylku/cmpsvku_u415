

function fetchAllTickets() {
        fetch('/rest/list')
            .then(response => response.json())
            .then(data => {
             
                const table = document.getElementById('ticket-table');
                // Loop through the data and add a row for each ticket
                data.forEach(ticket => {
                    const row = table.insertRow();
                    row.insertCell().innerHTML = ticket.id;
                    row.insertCell().innerHTML = ticket.type;
                    row.insertCell().innerHTML = ticket.subject;
                    row.insertCell().innerHTML = ticket.priority;
                    row.insertCell().innerHTML = ticket.status;
                    // Add a button to display the ticket details when clicked
                    const button = document.createElement('button');
                    button.textContent = 'View';
                    button.addEventListener('click', () => {
                        fetchTicketById(ticket.id);
                    });
                    row.insertCell().appendChild(button);
                });
            });
    }

    function fetchTicketById(id) {
        fetch(`/rest/ticket/${id}`)
            .then(response => response.json())
            .then(ticket => {
                const table = document.getElementById('ticket-table');
                table.innerHTML = ''; // clear existing rows

                const row = table.insertRow();
                row.insertCell().innerHTML = ticket.id;
                row.insertCell().innerHTML = ticket.type;
                row.insertCell().innerHTML = ticket.subject;
                row.insertCell().innerHTML = ticket.priority;
                row.insertCell().innerHTML = ticket.status;

                //  button to go back to the list of all tickets
                const button = document.createElement('button');
                button.textContent = 'Back';
                button.addEventListener('click', () => {
                    fetchAllTickets();
                });
                row.insertCell().appendChild(button);
            });
    }

    const allTicketsButton = document.getElementById('all-tickets-button');
    allTicketsButton.addEventListener('click', () => {
        fetchAllTickets();
    });