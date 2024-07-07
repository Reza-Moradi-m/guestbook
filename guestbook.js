// guestbook.js
import { saveMessage, getMessages, removeMessage } from './guestbook-utils.js';

const messageForm = document.getElementById('messageForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const messageInput = document.getElementById('messageInput');
const imageInput = document.getElementById('imageInput');
const messagesContainer = document.getElementById('messages');

// Function to create a message card
function createMessageCard(messageObj) {
    const { id, firstName, lastName, message, imageUrl } = messageObj;
    const messageCard = document.createElement('div');
    messageCard.classList.add('message-card');
    messageCard.innerHTML = `
        <h2>${firstName} ${lastName}</h2>
        <p>${message}</p>
        ${imageUrl ? `<img src="${imageUrl}" alt="User submitted image">` : ''}
        <button class="remove-button" data-id="${id}">Remove</button>
    `;
    return messageCard;
}

// Function to render messages
function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
        const messageCard = createMessageCard(msg);
        messagesContainer.appendChild(messageCard);
    });
}

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const message = messageInput.value.trim();
    const imageUrl = imageInput.value.trim();

    if (firstName && lastName && message) {
        const newMessage = { id: Date.now().toString(), firstName, lastName, message, imageUrl };
        await saveMessage(newMessage);
        const messageCard = createMessageCard(newMessage);
        messagesContainer.prepend(messageCard);
        messageForm.reset();
    }
});

messagesContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('remove-button')) {
        const id = e.target.getAttribute('data-id');
        await removeMessage(id);
        e.target.parentElement.remove();
    }
});

// Initial load of messages
document.addEventListener('DOMContentLoaded', async () => {
    const messages = await getMessages();
    renderMessages(messages);
});

