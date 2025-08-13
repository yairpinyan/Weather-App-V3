// Cursor Todo Helper Functions
const fs = require('fs');
const path = require('path');

const TODO_FILE = '.cursor-todo.md';

function generateTaskId() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `TASK-${date}-${random}`;
}

function getCurrentTimestamp() {
    return new Date().toISOString();
}

function readTodoFile() {
    try {
        return fs.readFileSync(TODO_FILE, 'utf8');
    } catch (error) {
        return null;
    }
}

function updateTodoFile(content) {
    fs.writeFileSync(TODO_FILE, content, 'utf8');
}

module.exports = {
    generateTaskId,
    getCurrentTimestamp,
    readTodoFile,
    updateTodoFile
};