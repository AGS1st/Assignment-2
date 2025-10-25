(() => {
    const projects =[
        { id: 1, title: "Portfolio v1", desc: "Static portfolio site", category: "web", date: "2024-08-01"},
        { id: 2, title: "Data Viz", desc: "Interactive charts with D3", category: "data", date: "2025-01-15" },
        { id: 3, title: "Blog Platform", desc: "CMS and markdown-powered blog", category: "web", date: "2023-11-02" },
        { id: 4, title: "ML Demo", desc: "Small ML model demo", category: "data", date: "2025-04-10" },
        { id: 5, title: "UX Case Study", desc: "Design research and prototypes", category: "other", date: "2024-12-05" },
    ];
    const yearEl = document.getElementById('year');
    const greetingText = document.getElementById('greeting-text');
    const greetingSub = document.getElementById('greeting-sub');
    const nameInput = document.getElementById('name-input');
    const saveNameBtn = document.getElementById('save-name');
    const clearNameBtn = document.getElementById('clear-name');

    const themeToggle = document.getElementById('theme-toggle');

    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = {
        about: document.getElementById('about'),
        projects: document.getElementById('projects'),
        contact: document.getElementById('contact'),
    };

    const projectList = document.getElementById('project-list');
    const searchInput = document.getElementById('search-projects');
    const filterCategory = document.getElementById('filter-category');
    const sortSelect = document.getElementById('sort-projects');
    const noProjects = document.getElementById('no-projects');

    const contactForm = document.getElementById('contact-form');
    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errMessage = document.getElementById('err-message');
    const formFeedback = document.getElementById('form-feedback');
    const resetFormBtn = document.getElementById('reset-form');

    const fetchQuoteBtn = document.getElementById('fetch-quote');
    const quoteResult = document.getElementById('quote-result');

    yearEl.textContent = new Date().getFullYear();

    function timeGreeting() {
        const h = new Date().getHours();
        if (h < 5) return 'Good night';
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    }

    function loadName() {
        const saved = localStorage.getItem('portfolio_name');
        if (saved) {
            greetingText.textContent = `${timeGreeting()}, ${saved}!`;
            greetingSub.textContent = 'Nice to see you again.';
            nameInput.value = saved;
        } else {
            greetingText.textContent = `${timeGreeting()}!`;
            greetingSub.textContent = 'Welcome to my interactive portfolio.';
        }
    }

    saveNameBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (!name) {
            alert('Please type a name before saving.');
            return;
        }
        localStorage.setItem('portfolio_name', name);
        loadName();
    });

    clearNameBtn.addEventListener('click', () => {
        localStorage.removeItem('portfolio_name');
        nameInput.value = '';
        loadName();
    });
    loadName();

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.setAttribute('aria-pressed', 'true');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.setAttribute('aria-pressed', 'false');
        }
            localStorage.setItem('portfolio_theme', theme);
    }

    themeToggle.addEventListener('click', () => {
        const current = localStorage.getItem('portfolio_theme') || 'light';
        applyTheme(current === 'light' ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('portfolio_theme') || 'light';
    applyTheme(savedTheme);

    function renderProjects(list) {
        projectList.innerHTML = '';
        if (!list.length) {
            noProjects.classList.remove('hidden');
            return;
        } else {
            noProjects.classList.add('hidden');
        }

        list.forEach(p => {
            const li = document.createElement('li');
            li.className = 'project-item';
            li.tabIndex = 0;
            li.innerHTML = `
                <div>
                    <strong>${escapeHtml(p.title)}</strong>
                    <div class="project-meta">${p.category} • ${p.date}</div>
                </div>
                <div class="project-body">${escapeHtml(p.desc)}</div>
                <div>
                    <button class="btn-toggle" aria-expanded="false">Details</button>
                    <div class="project-details hidden" style="margin-top:0.5rem">${escapeHtml('More details about ' + p.title)}</div>
                </div>
            `;
            const toggle = li.querySelector('.btn-toggle');
            const details = li.querySelector('.project-details');
            toggle.addEventListener('click', () => {
                const open = !details.classList.contains('hidden');
                details.classList.toggle('hidden');
                toggle.setAttribute('aria-expanded', String(!open));
            });
            projectList.appendChild(li);
        });
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const t = btn.dataset.target;
            for (const key in sections) sections[key].classList.add('hidden');
            sections[t].classList.remove('hidden');
            const heading = sections[t].querySelector('h3, h2');
            if (heading) heading.focus();
        });
    });

    if (searchInput && filterCategory && sortSelect) {
        searchInput.addEventListener('input', () => renderProjects(getFilteredProjects()));
        filterCategory.addEventListener('change', () => renderProjects(getFilteredProjects()));
        sortSelect.addEventListener('change', () => renderProjects(getFilteredProjects()));
    }
    
    function getFilteredProjects() {
        const q = searchInput.value.trim().toLowerCase();
        const cat = filterCategory.value;
        const sort = sortSelect.value;

        let list = projects.filter(p => {
            const matchesQ = !q || (p.title + ' ' + p.desc).toLowerCase().includes(q);
            const matchesCat = cat === 'all' ? true : p.category === cat;
            return matchesQ && matchesCat;
        });

        if (sort === 'title') {
            list.sort((a,b)=> a.title.localeCompare(b.title));
        } else {
            list.sort((a,b)=> new Date(b.date) - new Date(a.date));
        }
        return list;
    }

    searchInput.addEventListener('input', () => renderProjects(getFilteredProjects()));
    filterCategory.addEventListener('change', () => renderProjects(getFilteredProjects()));
    sortSelect.addEventListener('change', () => renderProjects(getFilteredProjects()));

    function escapeHtml(unsafe) {
        return String(unsafe).replace(/[&<>"'`]/g, (s) => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;', '`':'&#96;'
        })[s]);
    }

    renderProjects(getFilteredProjects());

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errName.textContent = errEmail.textContent = errMessage.textContent = '';
        formFeedback.textContent = '';

        const name = contactForm['name'].value.trim();
        const email = contactForm['email'].value.trim();
        const message = contactForm['message'].value.trim();

        let ok = true;
        if (!name) { errName.textContent = 'Name required'; ok = false; }
        if (!email || !validateEmail(email)) { errEmail.textContent = 'Valid email required'; ok = false; }
        if (!message || message.length < 10) { errMessage.textContent = 'Message must be at least 10 characters'; ok = false; }

        if (!ok) return;

        formFeedback.textContent = 'Sending…';
        const payload = { name, email, message, sentAt: new Date().toISOString() };

        setTimeout(() => {
            formFeedback.textContent = 'Message sent! Thank you — this is a demo (no server).';
            contactForm.reset();
            localStorage.setItem('portfolio_name', name);
            loadName();
        }, 800);
    });

    resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        errName.textContent = errEmail.textContent = errMessage.textContent = formFeedback.textContent = '';
    });

    fetchQuoteBtn.addEventListener('click', async () => {
        quoteResult.textContent = 'Loading…';
        try {
            const res = await fetch('https://api.quotable.io/random', { cache: 'no-store' });
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            quoteResult.textContent = `"${data.content}" — ${data.author}`;
        } catch (err) {
            console.warn('Quote fetch failed:', err);
            const fallback = [
            'Simplicity is the soul of efficiency. — Anonymous',
            'Done is better than perfect. — Anonymous',
            'Small progress is still progress. — Anonymous'
        ];
            quoteResult.textContent = fallback[Math.floor(Math.random() * fallback.length)];
        }
    });

})();