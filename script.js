// Telegram WebApp initialization
let tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
} else {
    tg = {
        initDataUnsafe: {
            user: {
                id: Date.now(),
                username: 'test_user_' + Math.random().toString(36).substr(2, 9),
                first_name: 'Test',
                last_name: 'User'
            }
        },
        expand: () => console.log('Mock expand'),
        ready: () => console.log('Mock ready')
    };
}

// State aplikasi - HARUS HANYA SATU KALI!
let currentUser = null;
let selectedHashtags = [];
let posts = [];
let currentTab = 'dinding';
let userHashtags = [];

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const mainScreen = document.getElementById('main-screen');
const hashtagScreen = document.getElementById('hashtag-screen');
const rageScreen = document.getElementById('rage-screen');
const telegramLoginBtn = document.getElementById('telegram-login-btn');

// Initialize app
function initApp() {
    console.log('App initializing...');
    
    const savedUser = localStorage.getItem('anonz_user');
    const savedHashtags = localStorage.getItem('anonz_hashtags');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        if (savedHashtags) {
            showMainScreen();
        } else {
            showHashtagScreen();
        }
    } else {
        showLoginScreen();
    }
}

// Screen functions
function showLoginScreen() {
    setScreenVisibility('login');
}

function showHashtagScreen() {
    setScreenVisibility('hashtag');
    selectedHashtags = [];
}

function showRageScreen() {
    setScreenVisibility('rage');
}

function showMainScreen() {
    setScreenVisibility('main');
    loadUserHashtags();
    switchTab('dinding');
}

function setScreenVisibility(activeScreen) {
    [loginScreen, hashtagScreen, rageScreen, mainScreen].forEach(screen => {
        if (screen) screen.classList.add('hidden');
    });
    
    switch(activeScreen) {
        case 'login':
            if (loginScreen) loginScreen.classList.remove('hidden');
            break;
        case 'hashtag':
            if (hashtagScreen) hashtagScreen.classList.remove('hidden');
            break;
        case 'rage':
            if (rageScreen) rageScreen.classList.remove('hidden');
            break;
        case 'main':
            if (mainScreen) mainScreen.classList.remove('hidden');
            break;
    }
}

// Telegram login
telegramLoginBtn.addEventListener('click', () => {
    if (tg.initDataUnsafe?.user) {
        const tgUser = tg.initDataUnsafe.user;
        currentUser = {
            id: tgUser.id,
            username: tgUser.username || `user_${tgUser.id}`,
            firstName: tgUser.first_name || 'Anon',
            lastName: tgUser.last_name || ''
        };
    } else {
        currentUser = {
            id: Date.now(),
            username: `anon_${Math.random().toString(36).substr(2, 9)}`,
            firstName: 'Anon',
            lastName: 'User'
        };
    }
    
    localStorage.setItem('anonz_user', JSON.stringify(currentUser));
    showHashtagScreen();
});

// Tab management
function loadUserHashtags() {
    const savedHashtags = localStorage.getItem('anonz_hashtags');
    if (savedHashtags) {
        userHashtags = JSON.parse(savedHashtags);
    }
}

function switchTab(tabName) {
    currentTab = tabName;
    console.log('Switched to tab:', tabName);
    // Tab logic akan ditambah nanti
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initApp);

// Helper functions
function getRandomEmoji(username) {
    const emojis = ['🕶️', '👻', '🐱', '🦊', '🐼', '🦄', '🐸', '🦋', '🐙', '🦉'];
    if (!username) return emojis[0];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length];
}
