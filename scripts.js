
function submitForm() {
    const type = document.getElementById("type").value;
    const subject = document.getElementById("subject").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const status = document.getElementById("status").value;
    const creator = document.getElementById("creator").value;
    const created_at = document.getElementById("created_at").value;

    if (!type || !subject || !description || !priority || !status || !creator || !created_at) {
        alert("Please fill in all fields.");
        return;
    }

    const data = {
        type,
        subject,
        description,
        priority,
        status,
        creator,
        created_at,
    };

    fetch('/rest/ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                alert('Ticket created successfully!');
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(json => {
            console.log(json);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function fetchAllTickets() {

    setTimeout(() => {
        fetch('/rest/list')
            .then(response => response.json())
            .then(data => {
             
                const table = document.getElementById('ticket-table');
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
    }, 300);
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
function showTicketForm() {
    document.getElementById("ticket-table").style.display = "none";
    document.getElementById("ticket-form").style.display = "block";
    document.getElementById("back-button").style.display = "block";
}

function hideTicketForm() {
    document.getElementById("ticket-table").style.display = "block";
    document.getElementById("ticket-form").style.display = "none";
    document.getElementById("back-button").style.display = "none";
}
