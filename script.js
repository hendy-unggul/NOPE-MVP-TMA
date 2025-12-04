// Tab management
let currentTab = 'dinding';
let userHashtags = [];// Telegram WebApp initialization
let tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
} else {
    // Mock for development
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

// State aplikasi
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
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username');
const userAvatar = document.getElementById('user-avatar');
const postContent = document.getElementById('post-content');
const postBtn = document.getElementById('post-btn');
const charCount = document.getElementById('char-count');
const postsContainer = document.getElementById('posts-container');
const refreshBtn = document.getElementById('refresh-btn');
const nextToRageBtn = document.getElementById('next-to-rage-btn');
const rageCharCount = document.getElementById('rage-char-count');
const postFirstRageBtn = document.getElementById('post-first-rage-btn');
const firstRageInput = document.getElementById('first-rage');

// Inisialisasi aplikasi
function initApp() {
    console.log('App initializing...');
    
    // Cek apakah user sudah login DAN sudah pilih hashtag
    const savedUser = localStorage.getItem('anonz_user');
    const savedHashtags = localStorage.getItem('anonz_hashtags');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('User found:', currentUser.username);
        
        if (savedHashtags) {
            // User sudah pilih hashtag, langsung ke main screen
            console.log('Hashtags found, showing main screen');
            showMainScreen();
        } else {
            // User belum pilih hashtag
            console.log('No hashtags, showing hashtag screen');
            showHashtagScreen();
        }
    } else {
        console.log('No user, showing login screen');
        showLoginScreen();
    }
}

// ================= SCREEN MANAGEMENT =================

function showLoginScreen() {
    console.log('Showing login screen');
    setScreenVisibility('login');
}

function showHashtagScreen() {
    console.log('Showing hashtag screen');
    setScreenVisibility('hashtag');
    
    // Reset selection
    selectedHashtags = [];
    updateSelectionCount();
}

function showRageScreen() {
    console.log('Showing rage screen');
    setScreenVisibility('rage');
    displaySelectedHashtags();
}

function showMainScreen()function loadUserHashtags() {
    console.log('Loading user hashtags');
    const savedHashtags = localStorage.getItem('anonz_hashtags');
    if (savedHashtags) {
        userHashtags = JSON.parse(savedHashtags);
        console.log('User hashtags loaded:', userHashtags);
        
        // Display user hashtags in profile
        displayUserHashtags();
    } else {
        console.log('No user hashtags found');
    }
} {
    console.log('Showing main screen');
    setScreenVisibility('main');
    
    // Update user info
    if (currentUser && usernameDisplay) {
        usernameDisplay.textContent = `@${currentUser.username}`;
        userAvatar.textContent = getRandomEmoji(currentUser.username);
    }
    
    // Display user hashtags
    displayUserHashtags();
    
    // Load posts
    loadPosts();
}

function setScreenVisibility(activeScreen) {
    // Hide all screens
    const screens = [loginScreen, hashtagScreen, rageScreen, mainScreen];
    screens.forEach(screen => {
        if (screen) screen.classList.add('hidden');
    });
    
    // Show active screen
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

// ================= HASHTAG SELECTION =================

// Event Listeners untuk hashtag selection
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners');
    
    // Setup hashtag checkboxes
    const checkboxes = document.querySelectorAll('input[name="hashtag"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                if (selectedHashtags.length < 3) {
                    selectedHashtags.push(this.value);
                    console.log('Added hashtag:', this.value);
                } else {
                    this.checked = false;
                    alert('Maksimal 3 hashtag!');
                }
            } else {
                selectedHashtags = selectedHashtags.filter(tag => tag !== this.value);
                console.log('Removed hashtag:', this.value);
            }
            
            updateSelectionCount();
        });
    });
    
    // Next button
    if (nextToRageBtn) {
        nextToRageBtn.addEventListener('click', showRageScreen);
    }
    
    // Rage input character count
    if (firstRageInput) {
        firstRageInput.addEventListener('input', function() {
            const count = this.value.length;
            if (rageCharCount) rageCharCount.textContent = count;
            if (postFirstRageBtn) {
                postFirstRageBtn.disabled = count === 0 || count > 280;
            }
        });
    }
    
    // Post first rage
    if (postFirstRageBtn) {
        postFirstRageBtn.addEventListener('click', postFirstRage);
    }
    
    // Telegram login
    if (telegramLoginBtn) {
        telegramLoginBtn.addEventListener('click', handleTelegramLogin);
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Post creation
    if (postContent) {
        postContent.addEventListener('input', updatePostCharCount);
    }
    
    if (postBtn) {
        postBtn.addEventListener('click', createPost);
    }
    
    // Refresh
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadPosts);
    }
    
    // Initialize app
    initApp();
});

function updateSelectionCount() {
    const countElement = document.getElementById('selected-count');
    if (countElement) {
        countElement.textContent = selectedHashtags.length;
    }
    
    if (nextToRageBtn) {
        nextToRageBtn.disabled = selectedHashtags.length !== 3;
    }
}

function displaySelectedHashtags() {
    const container = document.getElementById('selected-hashtags-display');
    if (container && selectedHashtags.length > 0) {
        container.innerHTML = selectedHashtags.map(tag => 
            `<div class="hashtag-pill">${tag}</div>`
        ).join('');
    }
}

// ================= FIRST RAGE =================

function postFirstRage() {
    if (!firstRageInput) return;
    
    const rageContent = firstRageInput.value.trim();
    
    if (rageContent.length === 0 || rageContent.length > 280) {
        alert('Tulis kesal kamu dulu! Max 280 karakter.');
        return;
    }
    
    // Save hashtags to localStorage
    localStorage.setItem('anonz_hashtags', JSON.stringify(selectedHashtags));
    
    // Create first post
    const firstPost = {
        id: Date.now(),
        username: currentUser.username,
        content: rageContent,
        hashtags: [...selectedHashtags],
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        avatar: getRandomEmoji(currentUser.username),
        isFirstRage: true
    };
    
    // Add to posts
    const savedPosts = localStorage.getItem('anonz_posts');
    posts = savedPosts ? JSON.parse(savedPosts) : [];
    posts.unshift(firstPost);
    localStorage.setItem('anonz_posts', JSON.stringify(posts));
    
    // Show main screen
    showMainScreen();
}

// ================= USER PROFILE =================

function displayUserHashtags() {
    const savedHashtags = localStorage.getItem('anonz_hashtags');
    if (savedHashtags) {
        const hashtags = JSON.parse(savedHashtags);
        const userInfo = document.querySelector('.user-info');
        
        if (userInfo) {
            // Remove existing hashtags display
            const existing = userInfo.querySelector('.user-hashtags');
            if (existing) {
                existing.remove();
            }
            
            // Add new hashtags display
            const hashtagContainer = document.createElement('div');
            hashtagContainer.className = 'user-hashtags';
            hashtagContainer.innerHTML = hashtags.map(tag => 
                `<span class="user-hashtag">${tag}</span>`
            ).join('');
            
            userInfo.appendChild(hashtagContainer);
        }
    }
}

// ================= LOGIN/LOGOUT =================

function handleTelegramLogin() {
    console.log('Telegram login clicked');
    
    if (tg.initDataUnsafe?.user) {
        const tgUser = tg.initDataUnsafe.user;
        currentUser = {
            id: tgUser.id,
            username: tgUser.username || `user_${tgUser.id}`,
            firstName: tgUser.first_name || 'Anon',
            lastName: tgUser.last_name || ''
        };
        console.log('Logged in via Telegram:', currentUser.username);
    } else {
        // Fallback for development
        currentUser = {
            id: Date.now(),
            username: `anon_${Math.random().toString(36).substr(2, 9)}`,
            firstName: 'Anon',
            lastName: 'User'
        };
        console.log('Logged in via mock:', currentUser.username);
    }
    
    localStorage.setItem('anonz_user', JSON.stringify(currentUser));
    showHashtagScreen();
}

function handleLogout() {
    if (confirm('Yakin mau keluar?')) {
        localStorage.removeItem('anonz_user');
        localStorage.removeItem('anonz_hashtags');
        currentUser = null;
        selectedHashtags = [];
        showLoginScreen();
    }
}

// ================= POST SYSTEM =================

function updatePostCharCount() {
    const count = postContent.value.length;
    charCount.textContent = count;
    
    if (count > 250) {
        charCount.style.color = '#ff6b6b';
    } else if (count > 200) {
        charCount.style.color = '#ffa726';
    } else {
        charCount.style.color = '#666';
    }
}

function createPost() {
    const content = postContent.value.trim();
    
    if (!content) {
        alert('Tulis sesuatu dulu!');
        return;
    }
    
    if (content.length > 280) {
        alert('Maksimal 280 karakter ya!');
        return;
    }
    
    const newPost = {
        id: Date.now(),
        username: currentUser.username,
        content: content,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        avatar: getRandomEmoji(currentUser.username)
    };
    
    posts.unshift(newPost);
    postContent.value = '';
    charCount.textContent = '0';
    charCount.style.color = '#666';
    
    savePosts();
    renderPosts();
    
    showNotification('Post berhasil dibuat! 🚀');
}

function loadPosts() {
    const savedPosts = localStorage.getItem('anonz_posts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    } else {
        // Sample posts
        posts = [
            {
                id: 1,
                username: 'anon_cat',
                content: 'Kenapa ya deadline selalu datang lebih cepat dari yang diharapkan? 😅',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                likes: 24,
                comments: [],
                avatar: '🐱'
            }
        ];
        savePosts();
    }
    
    renderPosts();
}

function savePosts() {
    localStorage.setItem('anonz_posts', JSON.stringify(posts));
}

function renderPosts() {
    if (!postsContainer) return;
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="empty-feed">Belum ada post, buat yang pertama! 🚀</div>';
        return;
    }
    
    postsContainer.innerHTML = posts.map(post => `
        <div class="post" data-id="${post.id}">
            <div class="post-header">
                <span class="post-avatar">${post.avatar}</span>
                <span class="post-username">@${post.username}</span>
                <span class="post-time">${formatTime(post.timestamp)}</span>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            ${post.hashtags ? `<div class="post-hashtags">${post.hashtags.map(tag => `<span class="post-hashtag">${tag}</span>`).join('')}</div>` : ''}
            <div class="post-actions">
                <button class="post-action-btn like-btn" onclick="likePost(${post.id})">
                    <span>👍</span> <span>${post.likes}</span>
                </button>
                <button class="post-action-btn" onclick="commentOnPost(${post.id})">
                    <span>💬</span> <span>${post.comments?.length || 0}</span>
                </button>
            </div>
        </div>
    `).join('');
}

// ================= HELPER FUNCTIONS =================

function getRandomEmoji(username) {
    const emojis = ['🕶️', '👻', '🐱', '🦊', '🐼', '🦄', '🐸', '🦋', '🐙', '🦉'];
    if (!username) return emojis[0];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length];
}

function formatTime(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'baru saja';
    if (diffMins < 60) return `${diffMins}m lalu`;
    if (diffHours < 24) return `${diffHours}j lalu`;
    if (diffDays < 7) return `${diffDays}h lalu`;
    return postTime.toLocaleDateString('id-ID');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Global functions for buttons
window.likePost = function(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        savePosts();
        renderPosts();
        showNotification('Liked! ❤️');
    }
};

window.commentOnPost = function(postId) {
    const comment = prompt('Tulis komentarmu:');
    if (comment && comment.trim()) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (!post.comments) post.comments = [];
            post.comments.push({
                username: currentUser.username,
                content: comment.trim(),
                timestamp: new Date().toISOString()
            });
            savePosts();
            renderPosts();
            showNotification('Komentar ditambahkan! 💬');
        }
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .empty-feed { text-align: center; padding: 40px; color: #666; font-style: italic; }
    
    .post-hashtags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin: 10px 0;
    }
    
    .post-hashtag {
        background: #e0e0e0;
        padding: 3px 8px;
        border-radius: 10px;
        font-size: 0.8em;
        color: #666;
    }
`;
document.head.appendChild(style);
function updateRageCounter() {
    const totalRages = posts.length;
    const counterElement = document.getElementById('total-rages');
    if (counterElement) {
        counterElement.textContent = totalRages;
    }
    
    // Add floating counter
    let floatingCounter = document.querySelector('.rage-counter');
    if (!floatingCounter) {
        floatingCounter = document.createElement('div');
        floatingCounter.className = 'rage-counter';
        floatingCounter.innerHTML = `🔥 ${totalRages} KESAL`;
        document.body.appendChild(floatingCounter);
    } else {
        floatingCounter.innerHTML = `🔥 ${totalRages} KESAL`;
    }
}

// Update di function loadPosts():
function loadPosts() {
    const savedPosts = localStorage.getItem('anonz_posts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    } else {
        posts = [];
    }
    
    renderPosts();
    updateRageCounter(); // TAMBAH INI
}

// Update di function renderPosts():
function renderPosts() {
    if (!postsContainer) return;
    
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-feed">
                <h3>🧱 DINDING KESAL MASIH KOSONG</h3>
                <p>Jadi yang pertama melampiaskan kekesalan!</p>
            </div>
        `;
        return;
    }
    
    postsContainer.innerHTML = posts.map(post => `
        <div class="post ${post.isFirstRage ? 'is-first-rage' : ''}" data-id="${post.id}">
            <div class="post-header">
                <span class="post-avatar">${post.avatar}</span>
                <span class="post-username">@${post.username}</span>
                <span class="post-time">${formatTime(post.timestamp)}</span>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            ${post.hashtags ? `
            <div class="post-hashtags">
                ${post.hashtags.map(tag => `<span class="post-hashtag">${tag}</span>`).join('')}
            </div>
            ` : ''}
            <div class="post-actions">
                <button class="post-action-btn like-btn" onclick="likePost(${post.id})">
                    <span>💢</span> <span>${post.likes} SETUJU</span>
                </button>
                <button class="post-action-btn" onclick="commentOnPost(${post.id})">
                    <span>💬</span> <span>${post.comments?.length || 0} RESPON</span>
                </button>
            </div>
        </div>
    `).join('');
}
