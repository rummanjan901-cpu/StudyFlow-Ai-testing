import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    observeAuth 
} from "./firebase-config.js";
import { getSummary, getQuiz } from "./ai-service.js";

// --- 1. UI ELEMENT SELECTORS ---
const authBtn = document.getElementById('authBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

// Summarizer Elements
const summarizeBtn = document.getElementById('summarizeBtn');
const summaryInput = document.getElementById('summaryInput');
const summaryResult = document.getElementById('summaryResult');

// Quiz Elements
const generateQuizBtn = document.getElementById('generateQuizBtn');
const quizTopic = document.getElementById('quizTopic');
const quizResult = document.getElementById('quizResult');

// To-Do Elements
const addTodoBtn = document.getElementById('addTodoBtn');
const todoTaskInput = document.getElementById('todoTask');
const todoList = document.getElementById('todoList');

// --- 2. AUTHENTICATION HANDLERS ---
observeAuth((user) => {
    if (user) {
        authBtn.innerText = "Logout";
        userEmailDisplay.innerText = user.email;
        console.log("Logged in as:", user.email);
    } else {
        authBtn.innerText = "Login / Sign Up";
        userEmailDisplay.innerText = "";
        console.log("No user signed in.");
    }
});

authBtn.addEventListener('click', async () => {
    if (authBtn.innerText === "Logout") {
        await logoutUser();
        alert("Logged out successfully.");
    } else {
        const action = confirm("Press OK to Login, or Cancel to Sign Up for a new account.");
        const email = prompt("Enter your Email:");
        const pass = prompt("Enter your Password:");

        if (email && pass) {
            const result = action 
                ? await loginUser(email, pass) 
                : await registerUser(email, pass);
            
            if (result.error) {
                alert("Auth Error: " + result.error);
            } else {
                alert(action ? "Welcome back!" : "Account created successfully!");
            }
        }
    }
});

// --- 3. AI SUMMARIZER LOGIC ---
summarizeBtn.addEventListener('click', async () => {
    const text = summaryInput.value.trim();
    if (!text) return alert("Please enter or paste some notes first!");

    summaryResult.innerText = "✨ AI is analyzing your content...";
    
    const summary = await getSummary(text);
    summaryResult.innerText = summary;
});

// --- 4. AI QUIZ GENERATOR LOGIC ---
generateQuizBtn.addEventListener('click', async () => {
    const topic = quizTopic.value.trim();
    if (!topic) return alert("Please enter a topic for the quiz!");

    quizResult.innerText = "🧠 AI is crafting your practice questions...";
    
    const quiz = await getQuiz(topic);
    // Using innerHTML to preserve formatting from AI response
    quizResult.innerHTML = `<div style="white-space: pre-wrap;">${quiz}</div>`;
});

// --- 5. STUDY PLAN (TO-DO) LOGIC ---
let tasks = JSON.parse(localStorage.getItem('study_tasks')) || [];

const renderTasks = () => {
    todoList.innerHTML = tasks.map((task, index) => `
        <li>
            <span>${task}</span>
            <i class="fas fa-trash" style="cursor:pointer; color:#e17055;" onclick="deleteTask(${index})"></i>
        </li>
    `).join('');
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
};

addTodoBtn.addEventListener('click', () => {
    const task = todoTaskInput.value.trim();
    if (task) {
        tasks.push(task);
        todoTaskInput.value = "";
        renderTasks();
    }
});

// Global function to allow HTML 'onclick' to work with modules
window.deleteTask = (index) => {
    tasks.splice(index, 1);
    renderTasks();
};

// Initial run to load any existing tasks
renderTasks();

// --- 6. FLOATING AI CHAT BUTTON ---
document.getElementById('floatingAiBtn').addEventListener('click', () => {
    const msg = prompt("Ask the AI Assistant anything:");
    if (msg) {
        alert("The AI says: Use the Summarizer or Quiz Generator cards to process specific study materials! This shortcut is for quick tips.");
    }
});
