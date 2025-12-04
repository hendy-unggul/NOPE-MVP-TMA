// Telegram Bot Auto-Start
document.addEventListener('DOMContentLoaded', function() {
    // Cek jika di Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Auto expand
        tg.expand();
        
        // Auto login jika ada user data
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            const currentUser = {
                id: user.id,
                username: user.username || `user_${user.id}`,
                firstName: user.first_name || 'Anon',
                lastName: user.last_name || ''
            };
            
            localStorage.setItem('anonz_user', JSON.stringify(currentUser));
            
            // Auto redirect ke main screen
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('main-screen').classList.remove('hidden');
            document.getElementById('username').textContent = `@${currentUser.username}`;
        }
    }
});// Inisialisasi WebApp Telegram
const tg = window.Telegram.WebApp;
tg.expand(); // Expand ke full screen

// State aplikasi
let currentUser = null;
let posts = [];

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const mainScreen = document.getElementById('main-screen');
const telegramLoginBtn = document.getElementById('telegram-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username');
const userAvatar = document.getElementById('user-avatar');
const postContent = document.getElementById('post-content');
const postBtn = document.getElementById('post-btn');
const charCount = document.getElementById('char-count');
const postsContainer = document.getElementById('posts-container');
const refreshBtn = document.getElementById('refresh-btn');

// Inisialisasi aplikasi
function initApp() {
    // Cek apakah user sudah login
    const savedUser = localStorage.getItem('anonz_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainScreen();
    } else {
        showLoginScreen();
    }
}

// Tampilkan login screen
function showLoginScreen() {
    loginScreen.classList.remove('hidden');
    mainScreen.classList.add('hidden');
}

// Tampilkan main screen
function showMainScreen() {
    loginScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    
    // Update user info
    usernameDisplay.textContent = `@${currentUser.username}`;
    userAvatar.textContent = getRandomEmoji(currentUser.username);
    
    // Load posts
    loadPosts();
}

// Generate random emoji berdasarkan username
function getRandomEmoji(username) {
    const emojis = ['🕶️', '👻', '🐱', '🦊', '🐼', '🦄', '🐸', '🦋', '🐙', '🦉'];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length];
}

// Login dengan Telegram
telegramLoginBtn.addEventListener('click', async () => {
    if (tg.initDataUnsafe?.user) {
        // Jika di dalam Telegram WebApp
        const tgUser = tg.initDataUnsafe.user;
        currentUser = {
            id: tgUser.id,
            username: tgUser.username || `user_${tgUser.id}`,
            firstName: tgUser.first_name,
            lastName: tgUser.last_name
        };
    } else {
        // Fallback untuk development (tanpa Telegram)
        currentUser = {
            id: Date.now(),
            username: `anon_${Math.random().toString(36).substr(2, 9)}`,
            firstName: 'Anon',
            lastName: 'User'
        };
    }
    
    // Simpan user ke localStorage
    localStorage.setItem('anonz_user', JSON.stringify(currentUser));
    
    // Tampilkan main screen
    showMainScreen();
});

// Logout
logoutBtn.addEventListener('click', () => {
    if (confirm('Yakin mau keluar?')) {
        localStorage.removeItem('anonz_user');
        currentUser = null;
        showLoginScreen();
    }
});

// Update character count
postContent.addEventListener('input', () => {
    const count = postContent.value.length;
    charCount.textContent = count;
    
    // Change color if approaching limit
    if (count > 250) {
        charCount.style.color = '#ff6b6b';
    } else if (count > 200) {
        charCount.style.color = '#ffa726';
    } else {
        charCount.style.color = '#666';
    }
});

// Create new post
postBtn.addEventListener('click', async () => {
    const content = postContent.value.trim();
    
    if (!content) {
        alert('Tulis sesuatu dulu!');
        return;
    }
    
    if (content.length > 280) {
        alert('Maksimal 280 karakter ya!');
        return;
    }
    
    // Create post object
    const newPost = {
        id: Date.now(),
        username: currentUser.username,
        content: content,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        avatar: getRandomEmoji(currentUser.username)
    };
    
    // Add to posts array
    posts.unshift(newPost);
    
    // Clear input
    postContent.value = '';
    charCount.textContent = '0';
    charCount.style.color = '#666';
    
    // Save to localStorage (temporary)
    savePosts();
    
    // Update UI
    renderPosts();
    
    // Simulate API call
    try {
        // For now, we'll just use localStorage
        // In production, replace with actual API call to Supabase
        console.log('Post created:', newPost);
        
        // Show success message
        showNotification('Post berhasil dibuat! 🚀');
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Gagal membuat post, coba lagi ya!');
    }
});

// Load posts from localStorage
function loadPosts() {
    const savedPosts = localStorage.getItem('anonz_posts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    } else {
        // Sample posts for first time users
        posts = [
            {
                id: 1,
                username: 'anon_cat',
                content: 'Kenapa ya deadline selalu datang lebih cepat dari yang diharapkan? 😅',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                likes: 24,
                comments: [],
                avatar: '🐱'
            },
            {
                id: 2,
                username: 'ghost_writer',
                content: 'Hari ini belajar 5 jam non-stop, proud of myself! 💪',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                likes: 42,
                comments: [],
                avatar: '👻'
            },
            {
                id: 3,
                username: 'coffee_addict',
                content: 'Kopi ketiga hari ini, tidur itu untuk yang lemah ☕️',
                timestamp: new Date(Date.now() - 10800000).toISOString(),
                likes: 31,
                comments: [],
                avatar: '🦊'
            }
        ];
        savePosts();
    }
    
    renderPosts();
}

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('anonz_posts', JSON.stringify(posts));
}

// Render posts to UI
function renderPosts() {
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

// Format waktu
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

// Like post function
window.likePost = function(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        savePosts();
        renderPosts();
        showNotification('Liked! ❤️');
    }
};

// Comment on post function
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

// Refresh posts
refreshBtn.addEventListener('click', () => {
    loadPosts();
    showNotification('Feed diperbarui! 🔄');
});

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message) {
    // Create notification element
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
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .empty-feed {
        text-align: center;
        padding: 40px;
        color: #666;
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', initApp);
