
function submitForm(id) {
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

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/rest/ticket/${id}` : '/rest/ticket';
    const text = id ? "updated" : "created";
    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                alert(`Ticket ${text} successfully!`);
                showTicketForm();
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

    function deleteTicketById(id) {
        fetch(`/rest/ticket/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    console.log(`Ticket with ID ${id} deleted successfully!`);
                    fetchAllTickets(); // Reload the table after deletion
                } else {
                    throw new Error('Network response was not ok');
                }
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
               table.innerHTML = ''; // clear existing rows

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
                    button.classList.add('view-button');
                    button.addEventListener('click', () => {
                        fetchTicketById(ticket.id);
                    });
                    row.insertCell().appendChild(button);
                    const buttonDelete = document.createElement('button-delete');
                    buttonDelete.textContent = 'Delete';
                    button.classList.add('button-delete');
                    buttonDelete.addEventListener('click', () => {
                        deleteTicketById(ticket.id);
                    });
                    row.insertCell().appendChild(buttonDelete);
                    const buttonUpdate = document.createElement('button-update');
                    buttonUpdate.textContent = 'Update';
                    button.classList.add('button-update');
                    buttonUpdate.setAttribute('data-id', ticket.id); // add data-id attribute
                    buttonUpdate.addEventListener('click', () => {
                        table.innerHTML = '';
                        populateUpdateForm(ticket.id); // pass ticket id to function
                    });
                    row.insertCell().appendChild(buttonUpdate);
                });

            });
    }, 100);

}async function populateUpdateForm(ticketId) {
    const form = document.getElementById('ticket-form');
    const typeField = form.querySelector('#type');
    const subjectField = form.querySelector('#subject');
    const descriptionField = form.querySelector('#description');
    const priorityField = form.querySelector('#priority');
    const statusField = form.querySelector('#status');
    const creatorField = form.querySelector('#creator');
    const createdAtField = form.querySelector('#created_at');
    const submitButton = form.querySelector('input[type="submit"]');

    const response = await fetch(`/rest/ticket/${ticketId}`);
    const data = await response.json();
    typeField.value = data.type;
    subjectField.value = data.subject;
    descriptionField.value = data.description;
    priorityField.value = data.priority;
    statusField.value = data.status;
    creatorField.value = data.creator;
    createdAtField.value = data.created_at;


    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        submitForm(ticketId);
    });
    form.style.display = 'block';
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
