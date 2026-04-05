const ADMIN_PAGES = ['dashboard.html', 'add-post.html', 'edit-post.html', 'users.html', 'messages.html'];

function getSidebarHtml() {
    const lang = getCurrentLang();
    return `
    <aside class="hidden lg:flex flex-col w-72 bg-gray-950 text-white fixed h-full z-50 shadow-2xl transition-all duration-300 overflow-hidden border-r border-gray-800">
        <a href="index.html" class="px-6 py-10 border-b border-gray-900 flex justify-center items-center bg-white mb-8 hover:bg-gray-50 transition-colors">
            <img src="Logo.png" alt="Logo" class="max-h-14 w-auto object-contain">
        </a>
        <nav class="flex-grow px-6 space-y-2">
            <p class="px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6">${t('admin')}</p>
            <a href="dashboard.html" data-page="dashboard" class="nav-link flex items-center px-4 py-4 text-gray-400 hover:text-white hover:bg-red-600 rounded-2xl transition-all duration-300 group">
                <span class="text-xl mr-4 group-hover:scale-125 transition-transform">📊</span>
                <span class="font-black italic text-sm tracking-tight">${t('dashboard')}</span>
            </a>
            <a href="add-post.html" data-page="add-post" class="nav-link flex items-center px-4 py-4 text-gray-400 hover:text-white hover:bg-red-600 rounded-2xl transition-all duration-300 group">
                <span class="text-xl mr-4 group-hover:scale-125 transition-transform">✍️</span>
                <span class="font-black italic text-sm tracking-tight">${t('new_post')}</span>
            </a>
            <a href="messages.html" id="sidebar-messages" data-page="messages" class="hidden nav-link flex items-center px-4 py-4 text-gray-400 hover:text-white hover:bg-red-600 rounded-2xl transition-all duration-300 group">
                <span class="text-xl mr-4 group-hover:scale-125 transition-transform">📩</span>
                <span class="font-black italic text-sm tracking-tight">පණිවිඩ (Messages)</span>
            </a>
            <a href="users.html" id="sidebar-users" data-page="users" class="hidden nav-link flex items-center px-4 py-4 text-gray-400 hover:text-white hover:bg-red-600 rounded-2xl transition-all duration-300 group">
                <span class="text-xl mr-4 group-hover:scale-125 transition-transform">👥</span>
                <span class="font-black italic text-sm tracking-tight">${t('users')}</span>
            </a>
            <div class="pt-12 mt-12 border-t border-gray-900/50">
                <p class="px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6">Language / භාෂාව</p>
                <div class="flex space-x-2 px-2 pb-8">
                    <button onclick="setLang('si')" class="w-10 h-10 flex items-center justify-center text-xs font-black rounded-full transition-all ${lang === 'si' ? 'bg-red-600 text-white shadow-xl' : 'bg-gray-900 text-gray-500 hover:text-white'}">SI</button>
                    <button onclick="setLang('ta')" class="w-10 h-10 flex items-center justify-center text-xs font-black rounded-full transition-all ${lang === 'ta' ? 'bg-red-600 text-white shadow-xl' : 'bg-gray-900 text-gray-500 hover:text-white'}">TA</button>
                    <button onclick="setLang('en')" class="w-10 h-10 flex items-center justify-center text-xs font-black rounded-full transition-all ${lang === 'en' ? 'bg-red-600 text-white shadow-xl' : 'bg-gray-900 text-gray-500 hover:text-white'}">EN</button>
                </div>
                <a href="index.html" class="flex items-center px-4 py-4 text-gray-400 hover:text-white hover:bg-gray-900 rounded-2xl transition-all">
                    <span class="text-xl mr-4">🏠</span>
                    <span class="font-black italic text-sm tracking-tight">${t('home')}</span>
                </a>
            </div>
        </nav>
        <div class="p-8">
            <button onclick="logout()" class="w-full flex items-center justify-center px-6 py-4 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white font-black rounded-2xl transition-all duration-300 border border-red-600/20 group uppercase text-xs tracking-widest">
                <span class="mr-3 group-hover:scale-110 transition-transform">🚪</span> ${t('logout')}
            </button>
        </div>
    </aside>

    <!-- Admin Mobile Header -->
    <header class="lg:hidden bg-white px-6 py-4 flex justify-between items-center shadow-md border-b border-gray-100 w-full fixed top-0 z-[60]">
        <a href="index.html"><img src="Logo.png" alt="Logo" class="h-10 w-auto"></a>
        <button id="admin-mobile-menu-btn" class="p-2 bg-gray-50 rounded-xl text-gray-900">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
    </header>

    <!-- Admin Mobile Menu Overlay -->
    <div id="admin-mobile-menu" class="fixed inset-0 bg-gray-950 z-[100] flex flex-col p-10 transform translate-x-full transition-transform duration-500 lg:hidden">
        <div class="flex justify-between items-center mb-12">
            <a href="index.html"><img src="Logo.png" alt="Logo" class="h-12 w-auto bg-white p-2 rounded-xl"></a>
            <button id="close-admin-mobile-menu" class="text-white">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <div class="flex flex-col space-y-6 flex-grow">
            <a href="dashboard.html" class="text-3xl font-black text-white italic">${t('dashboard')}</a>
            <a href="add-post.html" class="text-3xl font-black text-gray-400 hover:text-white italic">${t('new_post')}</a>
            <a href="messages.html" id="mobile-sidebar-messages" class="hidden text-3xl font-black text-gray-400 hover:text-white italic">පණිවිඩ (Messages)</a>
            <a href="users.html" id="mobile-sidebar-users" class="hidden text-3xl font-black text-gray-400 hover:text-white italic">${t('users')}</a>
            <div class="border-t border-gray-800 my-4"></div>
            <a href="index.html" class="text-3xl font-black text-red-500 italic">🏠 ${t('home')}</a>
        </div>
        <button onclick="logout()" class="w-full py-6 bg-red-600 text-white font-black rounded-3xl text-xl shadow-2xl">
            ${t('logout')}
        </button>
    </div>
    `;
}

function getNavbarHtml() {
    const lang = getCurrentLang();
    return `
    <nav class="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <a href="index.html" class="flex items-center">
            <img src="Logo.png" alt="Logo" class="h-16 md:h-20 w-auto object-contain">
        </a>
        <div class="hidden lg:flex space-x-8 items-center">
            <div class="relative group">
                <a href="index.html" class="text-gray-700 hover:text-primary-600 font-bold transition py-2 flex items-center">
                    ${t('home')} <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </a>
                <div class="absolute left-0 mt-0 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 origin-top overflow-hidden p-6">
                    <div class="grid grid-cols-2 gap-8" id="nav-mega-menu"></div>
                </div>
            </div>
            <a href="category.html?type=hot_news" class="text-gray-700 hover:text-primary-600 font-bold transition">${t('hot_news')}</a>
            <a href="category.html?type=features" class="text-gray-700 hover:text-primary-600 font-bold transition">${t('features')}</a>
            <a href="category.html?type=sports" class="text-gray-700 hover:text-primary-600 font-bold transition">${t('sports')}</a>
            <a href="category.html?type=overseas" class="text-gray-700 hover:text-primary-600 font-bold transition">${t('overseas')}</a>
            <a href="announcements.html" class="text-gray-700 hover:text-primary-600 font-bold transition">${t('announcement')}</a>
            <a href="archive.html" class="text-gray-700 hover:text-primary-600 font-bold transition">${t('archive')}</a>
            <a href="contact.html" class="text-gray-700 hover:text-primary-600 font-bold transition">${t('contact')}</a>
            
            <!-- Search Bar -->
            <div class="relative ml-4">
                <form action="search.html" method="GET" class="relative group">
                    <input type="text" name="q" placeholder="${t('search_placeholder')}" 
                        class="w-48 xl:w-64 pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-xs font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none">
                    <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </form>
            </div>
        </div>
        <div class="flex items-center space-x-6">
            <!-- Language Switcher -->
            <div class="hidden md:flex items-center space-x-1 text-xs font-black bg-gray-100 p-1 rounded-full border border-gray-200">
                <button onclick="setLang('si')" class="px-3 py-1.5 rounded-full transition ${lang==='si' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}">සිංහල</button>
                <button onclick="setLang('ta')" class="px-3 py-1.5 rounded-full transition ${lang==='ta' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}">தமிழ்</button>
                <button onclick="setLang('en')" class="px-3 py-1.5 rounded-full transition ${lang==='en' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}">EN</button>
            </div>
            <div id="auth-nav-btns" class="flex space-x-2">
                <a href="admin-login.html" class="px-5 py-2.5 bg-primary-600 text-white rounded-full font-bold shadow-md hover:bg-primary-700 transition" id="nav-login-btn">${t('admin')}</a>
                <div id="admin-dropdown" class="hidden relative group">
                    <button class="px-5 py-2.5 bg-gray-900 text-white rounded-full font-bold shadow-md hover:bg-black transition flex items-center">
                        ${t('admin')} <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                        <div class="p-2 space-y-1 text-sm">
                            <a href="dashboard.html" class="block px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-bold leading-tight">📊 ${t('dashboard')}</a>
                            <a href="add-post.html" class="block px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-bold leading-tight">✍️ ${t('new_post')}</a>
                            <a href="users.html" id="admin-nav-users" class="hidden px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-bold leading-tight">👥 ${t('users')}</a>
                            <a href="change-password.html" class="block px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-bold leading-tight">🔐 මුරපදය වෙනස් කරන්න</a>
                            <div class="border-t border-gray-100 my-1"></div>
                            <button onclick="logout()" class="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition font-bold leading-tight">🚪 ${t('logout')}</button>
                        </div>
                    </div>
                </div>
            </div>
            <button class="lg:hidden text-gray-800" id="mobile-menu-btn">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
    </nav>
    <div id="mobile-menu" class="fixed inset-0 bg-white z-[100] flex flex-col p-8 transform translate-x-full transition-transform duration-300 lg:hidden text-gray-800 shadow-2xl">
        <div class="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
            <img src="Logo.png" alt="Logo" class="h-10 w-auto">
            <div class="flex space-x-2 mr-4">
                 <button onclick="setLang('si')" class="w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-bold ${lang==='si' ? 'bg-primary-600 text-white' : 'bg-gray-100'}">SI</button>
                 <button onclick="setLang('ta')" class="w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-bold ${lang==='ta' ? 'bg-primary-600 text-white' : 'bg-gray-100'}">TA</button>
                 <button onclick="setLang('en')" class="w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-bold ${lang==='en' ? 'bg-primary-600 text-white' : 'bg-gray-100'}">EN</button>
            </div>
            <button id="close-mobile-menu">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <div class="mb-6">
            <form action="search.html" method="GET" class="relative">
                <input type="text" name="q" placeholder="${t('search_placeholder')}" 
                    class="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-50 transition-all outline-none">
                <svg class="absolute left-4 top-4.5 w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </form>
        </div>
        <div class="flex flex-col space-y-4 text-xl font-extrabold flex-grow overflow-y-auto">
            <a href="index.html" class="text-primary-600 py-2">${t('home')}</a>
            <a href="category.html?type=hot_news" class="py-2 border-b border-gray-50">${t('hot_news')}</a>
            <a href="category.html?type=features" class="py-2 border-b border-gray-50">${t('features')}</a>
            <a href="category.html?type=sports" class="py-2 border-b border-gray-50">${t('sports')}</a>
            <a href="category.html?type=overseas" class="py-2 border-b border-gray-50">${t('overseas')}</a>
            <a href="announcements.html" class="py-2 border-b border-gray-50">${t('announcement')}</a>
            <a href="archive.html" class="py-2 border-b border-gray-50">${t('archive')}</a>
            <a href="contact.html" class="py-2">${t('contact')}</a>
        </div>
    </div>
    `;
}

function getFooterHtml() {
    return `
    <footer class="bg-red-950 text-white py-16 mt-auto">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-red-900 pb-12">
                <div class="space-y-6">
                    <div class="bg-white p-4 rounded-2xl inline-block">
                        <img src="Logo.png" alt="Logo" class="h-16 w-auto">
                    </div>
                    <p class="text-red-100 leading-relaxed font-bold italic text-sm">Sri Lanka POST News Service.</p>
                </div>
                <div>
                    <h3 class="text-lg font-bold mb-6 text-white border-l-4 border-primary-500 pl-4 uppercase tracking-widest">${t('categories')}</h3>
                    <ul class="space-y-3 font-medium">
                        <li><a href="category.html?type=hot_news" class="text-red-200 hover:text-white transition">${t('hot_news')}</a></li>
                        <li><a href="category.html?type=features" class="text-red-200 hover:text-white transition">${t('features')}</a></li>
                        <li><a href="category.html?type=sports" class="text-red-200 hover:text-white transition">${t('sports')}</a></li>
                        <li><a href="category.html?type=overseas" class="text-red-200 hover:text-white transition">${t('overseas')}</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-bold mb-6 text-white border-l-4 border-primary-500 pl-4 uppercase tracking-widest">${t('support')}</h3>
                    <ul class="space-y-3 font-medium">
                        <li><a href="index.html" class="text-red-200 hover:text-white transition">${t('home')}</a></li>
                        <li><a href="announcements.html" class="text-red-200 hover:text-white transition">${t('announcement')}</a></li>
                        <li><a href="archive.html" class="text-red-200 hover:text-white transition">${t('archive')}</a></li>
                        <li><a href="contact.html" class="text-red-200 hover:text-white transition">${t('contact')}</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-bold mb-6 text-white border-l-4 border-primary-500 pl-4 uppercase tracking-widest">${t('contact_us')}</h3>
                    <div class="space-y-4 text-red-100">
                        <div class="flex items-start">
                            <span class="text-xl mr-3 font-bold text-primary-500">📍</span>
                            <p class="text-sm font-medium">${t('addr')}</p>
                        </div>
                        <div class="flex items-start">
                            <span class="text-xl mr-3 font-bold text-primary-500">📞</span>
                            <p class="text-sm font-medium">+94 112 695 372</p>
                        </div>
                        <div class="flex items-center italic opacity-80 text-xs">supdt.mkt@slpost.lk</div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-red-300">
                <p>© 2026 Sri Lanka POST Marketing and Research. ${t('copyright')}</p>
            </div>
        </div>
    </footer>
    `;
}

const typeLabels = {
    'hot_news': t('hot_news'),
    'features': t('features'),
    'sports': t('sports'),
    'overseas': t('overseas'),
    'news': 'පුවත්',
    'announcement': t('announcement')
};

async function loadMegaMenu() {
    const menuContainer = document.getElementById('nav-mega-menu');
    if (!menuContainer) return;
    try {
        if (typeof getAllPosts !== 'function') return;
        const allPosts = await getAllPosts();
        const grouped = allPosts.reduce((acc, post) => {
            if (!acc[post.type]) acc[post.type] = [];
            if (acc[post.type].length < 3) acc[post.type].push(post);
            return acc;
        }, {});
        const typesToShow = ['hot_news', 'features', 'sports', 'overseas'];
        menuContainer.innerHTML = typesToShow.map(type => {
            const posts = grouped[type] || [];
            const label = translations[getCurrentLang()]?.[type] || translations['si'][type] || type;
            return `<div><h3 class="text-sm font-bold text-primary-600 uppercase mb-3 border-b border-red-50 pb-1">${label}</h3>
                <ul class="space-y-2">${posts.map(p => `<li><a href="article.html?id=${p.id}" class="text-sm text-gray-600 hover:text-primary-600 transition line-clamp-1 italic">${getP(p, 'title')}</a></li>`).join('')}
                <li><a href="category.html?type=${type}" class="text-xs text-primary-500 font-bold hover:underline">${t('see_all')}</a></li></ul></div>`;
        }).join('');
    } catch (err) { console.error("Mega menu error:", err); }
}

function initNavbar() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    const isAdminPage = ADMIN_PAGES.includes(filename);
    const placeholder = document.getElementById('navbar-placeholder');
    
    if (isAdminPage) {
        const sidebarHtml = getSidebarHtml();
        if (placeholder) { placeholder.innerHTML = sidebarHtml; }
        else { document.body.insertAdjacentHTML('afterbegin', sidebarHtml); }
        
        document.body.classList.remove('flex-col');
        document.body.classList.add('lg:flex-row');
        const main = document.querySelector('main');
        if (main) {
            main.classList.add('lg:ml-72', 'w-full', 'pt-24', 'lg:pt-0');
        }

        const mBtn = document.getElementById('admin-mobile-menu-btn');
        const mMenu = document.getElementById('admin-mobile-menu');
        const cMBtn = document.getElementById('close-admin-mobile-menu');
        if (mBtn && mMenu && cMBtn) {
            mBtn.onclick = () => mMenu.classList.remove('translate-x-full');
            cMBtn.onclick = () => mMenu.classList.add('translate-x-full');
        }

        if (typeof isAuthenticated === 'function' && isAuthenticated() && typeof getUserRole === 'function') {
            if (getUserRole() === 'admin') {
                document.getElementById('sidebar-users')?.classList.remove('hidden');
                document.getElementById('sidebar-messages')?.classList.remove('hidden');
                document.getElementById('mobile-sidebar-users')?.classList.remove('hidden');
                document.getElementById('mobile-sidebar-messages')?.classList.remove('hidden');
            }
        }
    } else {
        const navbarHtml = getNavbarHtml();
        if (placeholder) { placeholder.innerHTML = navbarHtml; }
        else { document.body.insertAdjacentHTML('afterbegin', navbarHtml); }

        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (nav && window.scrollY > 20) {
                nav.classList.add('py-2', 'shadow-2xl');
                nav.classList.remove('py-4');
            } else if (nav) {
                nav.classList.add('py-4'); nav.classList.remove('py-2', 'shadow-2xl');
            }
        });

        const mBtn = document.getElementById('mobile-menu-btn');
        const mMenu = document.getElementById('mobile-menu');
        const cMBtn = document.getElementById('close-mobile-menu');
        if (mBtn && mMenu && cMBtn) {
            mBtn.onclick = () => mMenu.classList.remove('translate-x-full');
            cMBtn.onclick = () => mMenu.classList.add('translate-x-full');
        }

        if (typeof isAuthenticated === 'function' && isAuthenticated()) {
            document.getElementById('nav-login-btn')?.classList.add('hidden');
            document.getElementById('admin-dropdown')?.classList.remove('hidden');
            if (typeof getUserRole === 'function' && getUserRole() === 'admin') {
                document.getElementById('admin-nav-users')?.classList.remove('hidden');
            }
        }
        loadMegaMenu();
        document.body.insertAdjacentHTML('beforeend', getFooterHtml());
    }
}

// Global styles
const style = document.createElement('style');
style.textContent = `
    .glass { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(15px); border-bottom: 2px solid rgba(239, 68, 68, 0.05); }
    .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
`;
document.head.appendChild(style);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}
