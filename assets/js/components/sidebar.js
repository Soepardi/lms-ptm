// Fluent Sidebar Component
// This creates a unified sidebar across all pages for SPA-like experience

const FluentSidebar = {
    async init(activePage = 'home') {
        const sidebarHtml = await this.render(activePage);
        const sidebarContainer = document.getElementById('app-sidebar');

        if (sidebarContainer) {
            sidebarContainer.innerHTML = sidebarHtml;
            this.attachEventListeners();
        }
    },

    getBasePath() {
        const path = window.location.pathname;

        // Level 2 directories
        if (path.includes('/dashboard/student/') ||
            path.includes('/dashboard/instructor/') ||
            path.includes('/dashboard/admin/')) {
            return '../..';
        }

        // Level 1 directories
        if (path.includes('/course/') ||
            path.includes('/lesson/') ||
            path.includes('/auth/') ||
            path.includes('/report/') ||
            path.includes('/assignment/') ||
            path.includes('/settings/')) {
            return '..';
        }

        // Root or unknown (Level 0)
        return '.';
    },

    async render(activePage) {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        let userRole = 'student';
        let profile = null;

        if (session) {
            // Priority 1: Check user_metadata first (faster)
            if (session.user?.user_metadata?.role) {
                userRole = session.user.user_metadata.role;
            }

            // Priority 2: Confirm with DB profile (more reliable)
            const { data } = await supabase.from('profiles').select('role, full_name').eq('id', session.user.id).single();
            if (data) {
                userRole = data.role;
                profile = data;
            }
        }

        // Determine current page for active state
        const currentPath = window.location.pathname;
        const bp = this.getBasePath();

        return `
            <aside class="w-[260px] bg-[#FAF9F8] border-r border-[#EDEBE9] flex flex-col pt-6 pb-4 shrink-0">
                <div class="px-6 mb-8">
                    <a href="${bp}/index.html" class="flex items-center gap-3 group">
                        <img src="${bp}/assets/images/logo.png" alt="Logo" class="w-8 h-8 object-contain transition-transform group-hover:scale-110">
                        <span class="text-sm font-bold text-[#323130] leading-tight group-hover:text-[#0078D4] transition-colors">
                            Pesantren Teknologi Majapahit
                        </span>
                    </a>
                </div>

                <div class="flex-1 overflow-y-auto px-3 space-y-1">
                    <div class="px-3 mb-2 text-caption font-semibold text-[#8A8886] uppercase tracking-wide">Navigate</div>
                    
                    <a href="${bp}/dashboard/${userRole}/index.html" 
                        class="sidebar-link ${currentPath.includes('dashboard') && activePage === 'home' ? 'active' : ''}">
                        <ion-icon name="home-outline"></ion-icon> Home
                    </a>
                    
                    ${userRole !== 'instructor' ? `
                    <a href="${bp}/course/catalog.html" 
                        class="sidebar-link ${currentPath.includes('catalog') || activePage === 'discover' ? 'active' : ''}">
                        <ion-icon name="compass-outline"></ion-icon> Jelajahi
                    </a>
                    
                    <a href="${bp}/course/my_courses.html" 
                        class="sidebar-link ${currentPath.includes('my_courses') || activePage === 'my-courses' ? 'active' : ''}">
                        <ion-icon name="library-outline"></ion-icon> Kelas Saya
                    </a>
                    
                    <a href="${bp}/report/index.html" 
                        class="sidebar-link ${currentPath.includes('report') || activePage === 'report' ? 'active' : ''}">
                        <ion-icon name="ribbon-outline"></ion-icon> Raport Belajar
                    </a>` : ''}

                    ${this.renderRoleSpecificLinks(userRole, activePage, currentPath, bp)}
                </div>

                ${this.renderUserSection(session, profile, bp)}
            </aside>
        `;
    },

    renderRoleSpecificLinks(userRole, activePage, currentPath, bp) {
        if (userRole === 'instructor') {
            return `
                <div class="h-px bg-[#EDEBE9] my-2"></div>
                <a href="${bp}/course/create.html" class="sidebar-link ${currentPath.includes('create') || activePage === 'create-course' ? ' active' : ''}">
                    <ion-icon name="add-circle-outline"></ion-icon> Buat Kelas
                </a>
            `;
        }
        return '';
    },

    renderUserSection(session, profile, bp) {
        if (session) {
            const initial = profile?.full_name?.charAt(0) || session.user.email.charAt(0);
            const displayName = profile?.full_name || session.user.email.split('@')[0];

            return `
                <div class="px-3 pt-4 border-t border-[#EDEBE9]">
                    <div class="relative">
                        <div class="flex items-center gap-3 p-2 rounded-md hover:bg-[#F3F2F1] cursor-pointer transition-colors" id="user-menu-trigger">
                            <div class="w-8 h-8 rounded-full bg-[#0078D4] flex items-center justify-center text-white text-xs font-bold">
                                ${initial.toUpperCase()}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="text-caption font-semibold truncate">${displayName}</div>
                                <div class="text-caption text-[#8A8886]">Account</div>
                            </div>
                            <ion-icon name="chevron-up" class="text-[#8A8886]"></ion-icon>
                        </div>
                        
                        <!-- User Menu (Dropup) -->
                        <div id="user-menu" class="hidden absolute bottom-full left-0 w-full mb-2 p-2 bg-white rounded-lg shadow-xl border border-[#EDEBE9] z-50">
                            <a href="${bp}/settings/index.html" class="block px-3 py-2 text-body rounded-md hover:bg-[#F3F2F1] transition-colors">
                                <ion-icon name="settings-outline" class="mr-2"></ion-icon> Pengaturan
                            </a>
                            <div class="h-px bg-[#EDEBE9] my-2"></div>
                            <button id="logout-btn" class="w-full text-left px-3 py-2 text-body rounded-md hover:bg-[#F3F2F1] transition-colors text-red-600">
                                <ion-icon name="log-out-outline" class="mr-2"></ion-icon> Keluar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="px-3 pt-4 border-t border-[#EDEBE9]">
                    <a href="${bp}/auth/login.html" class="btn-fluent btn-primary-fluent w-full">
                        Masuk
                    </a>
                </div>
            `;
        }
    },

    attachEventListeners() {
        // User menu toggle
        const userMenuTrigger = document.getElementById('user-menu-trigger');
        const userMenu = document.getElementById('user-menu');

        if (userMenuTrigger && userMenu) {
            userMenuTrigger.addEventListener('click', () => {
                userMenu.classList.toggle('hidden');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuTrigger.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.add('hidden');
                }
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {

            logoutBtn.addEventListener('click', async () => {
                await supabase.auth.signOut();
                window.location.href = `${this.getBasePath()}/index.html`;
            });
        }

        // Add smooth scroll behavior for internal links
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Add active state animation
                link.classList.add('scale-95');
                setTimeout(() => link.classList.remove('scale-95'), 100);
            });
        });
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Determine active page from data attribute or URL
        const activePageAttr = document.body.getAttribute('data-active-page');
        FluentSidebar.init(activePageAttr || 'home');
    });
} else {
    const activePageAttr = document.body.getAttribute('data-active-page');
    FluentSidebar.init(activePageAttr || 'home');
}
