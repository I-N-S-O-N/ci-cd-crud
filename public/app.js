// DOM Elements
const addCardModal = new bootstrap.Modal(document.getElementById('addCardModal'));
let currentCards = [];

// Fetch all cards
async function fetchCards() {
    try {
        const response = await fetch('http://13.60.73.69/api/cards');
        currentCards = await response.json();
        renderCards();
    } catch (error) {
        console.error('Error fetching cards:', error);
    }
}

// Render cards
function renderCards() {
    const lists = ['todo', 'inprogress', 'done'];
    lists.forEach(list => {
        const container = document.getElementById(`${list}-list`);
        container.innerHTML = '';
        
        const listCards = currentCards.filter(card => card.list === list);
        listCards.forEach(card => {
            const cardElement = createCardElement(card);
            container.appendChild(cardElement);
        });
    });
}

// Create card element
function createCardElement(card) {
    const div = document.createElement('div');
    div.className = 'card';
    div.draggable = true;
    div.innerHTML = `
        <h6>${card.title}</h6>
        <p class="mb-0">${card.description}</p>
        <button class="btn btn-sm btn-danger mt-2" onclick="deleteCard('${card._id}')">Delete</button>
    `;
    
    div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('cardId', card._id);
    });
    
    return div;
}

// Show add card modal
function showAddCardModal(list) {
    document.getElementById('listType').value = list;
    document.getElementById('cardTitle').value = '';
    document.getElementById('cardDescription').value = '';
    addCardModal.show();
}

// Add new card
async function addCard() {
    const title = document.getElementById('cardTitle').value;
    const description = document.getElementById('cardDescription').value;
    const list = document.getElementById('listType').value;
    
    try {
        const response = await fetch('http://13.60.73.69/api/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                list,
                order: currentCards.length
            })
        });
        
        const newCard = await response.json();
        currentCards.push(newCard);
        renderCards();
        addCardModal.hide();
    } catch (error) {
        console.error('Error adding card:', error);
    }
}

// Delete card
async function deleteCard(cardId) {
    try {
        await fetch(`http://13.60.73.69/api/cards/${cardId}`, {
            method: 'DELETE'
        });
        currentCards = currentCards.filter(card => card._id !== cardId);
        renderCards();
    } catch (error) {
        console.error('Error deleting card:', error);
    }
}

// Add drag and drop listeners
document.querySelectorAll('.cards-container').forEach(container => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    container.addEventListener('drop', async (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('cardId');
        const newList = container.id.split('-')[0];
        
        try {
            const response = await fetch(`http://13.60.73.69/api/cards/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ list: newList })
            });
            
            const updatedCard = await response.json();
            currentCards = currentCards.map(card => 
                card._id === cardId ? updatedCard : card
            );
            renderCards();
        } catch (error) {
            console.error('Error updating card:', error);
        }
    });
});

// Initial load
fetchCards();
