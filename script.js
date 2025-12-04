// MONKEY FIX - SIMPLE VERSION
console.log('🐵 MONKEY SCRIPT LOADED');

// Force clear old data on every load
try {
    localStorage.removeItem('anonz_user');
    localStorage.removeItem('anonz_hashtags');
    console.log('🐵 Old data cleared');
} catch (e) {
    console.log('🐵 No old data to clear');
}

// Simple Telegram check - NO OPTIONAL CHAINING!
let tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
    console.log('🐵 Telegram WebApp detected');
    tg.ready();
    tg.expand();
} else {
    console.log('🐵 Running in browser mode');
    tg = { initDataUnsafe: { user: null } };
}

// Simple state
let currentUser = null;

// Show login screen ALWAYS on start
console.log('🐵 Showing login screen');
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('hashtag-screen').classList.add('hidden');
    document.getElementById('rage-screen').classList.add('hidden');
    
    // Login button
    document.getElementById('telegram-login-btn').addEventListener('click', function() {
        console.log('🐵 Login clicked');
        
        // Create test user
        currentUser = {
            id: Date.now(),
            username: 'monkey_' + Math.random().toString(36).substr(2, 5),
            firstName: 'Monkey',
            lastName: 'User'
        };
        
        console.log('🐵 User created:', currentUser.username);
        localStorage.setItem('anonz_user', JSON.stringify(currentUser));
        
        // Go to hashtag screen
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('hashtag-screen').classList.remove('hidden');
        console.log('🐵 Moved to hashtag screen');
    });
});

console.log('🐵 Script ready');
