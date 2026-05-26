const isAvailable = available => available === true;
const formatPrice = price => '$' + price.toFixed(2);
const FAVORITES_KEY = 'sto-favorites';

const tours = [
    { name: 'Cascade Ridge Hike', price: 149, available: true, category: 'hiking', img: 'images/cascade-ridge-hike.jpg', alt: 'Pine forest with sunlit mountains on the Cascade Ridge Hike' },
    { name: 'Summit Loop Trek', price: 199, available: true, category: 'hiking', img: 'images/summit-loop-trek.jpg', alt: 'Green trees near a mountain lake on the Summit Loop Trek' },
    { name: 'Valley Floor Walk', price: 99, available: false, category: 'walking', img: 'images/valley-floor-walk.jpg', alt: 'Fern-lined forest path on the Valley Floor Walk' },
];

function loadFavorites() {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

const favoritesList = document.querySelector('.favorites-list');
if (favoritesList) {
  favoritesList.addEventListener('click', (event) => {
    const btn = event.target.closest('.btn-remove-favorite');
    if (!btn) return;

    const name = btn.dataset.tour;
    favorites = favorites.filter(f => f !== name);
    saveFavorites();
    renderFavorites();
  });
}

function renderFavorites() {
    if (!favoritesList) return;
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<li class="favorites-empty">No favorites saved yet.</li>';
        return;
    }

    favorites.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.dataset.tour = name;
        removeBtn.className = 'btn-remove-favorite';

        li.appendChild(removeBtn);
        favoritesList.appendChild(li);
    });
}

let favorites = loadFavorites();
renderFavorites();

function renderTourCard(tour) {
    const status = tour.available ? 'Available' : 'Sold Out';
    return `
    <article class="tour-card" data-category="${tour.category}">
      <div class="tour-card-image-wrap">
        <img class="tour-card-image" src="${tour.img}" alt="${tour.alt}">
      </div>
      <div class="tour-card-body">
        <h3>${tour.name}</h3>
        <p class="tour-price">${formatPrice(tour.price)}</p>
        <p class="tour-status">${status}</p>
        <button class="btn-add-favorite">Add to Favorites</button>
      </div>
    </article>
  `;
}

const container = document.querySelector('.tours-grid');
if (container) {
    for (const tour of tours) {
        container.insertAdjacentHTML('beforeend', renderTourCard(tour));
    }

    container.addEventListener('click', (event) => {
        const btn = event.target.closest('.btn-add-favorite');
        if (!btn) return;

        const card = btn.closest('.tour-card');
        if (!card) return;

        const name = card.querySelector('h3').textContent;
        if (!favorites.includes(name)) {
            favorites.push(name);
            saveFavorites();
            renderFavorites();
        }

        container.querySelectorAll('.tour-card').forEach(c => {
            c.classList.remove('active');
        });

        card.classList.add('active');


    });
}

const hamburgerBtn = document.querySelector('.hamburger-btn');
const nav = document.querySelector('.site-nav');

if (hamburgerBtn && nav) {
    hamburgerBtn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav-open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (event) => {
        if (!nav.classList.contains('nav-open')) return;

        const clickedInsideNav = nav.contains(event.target);
        const clickedButton = hamburgerBtn.contains(event.target);

        if (!clickedInsideNav && !clickedButton) {
            nav.classList.remove('nav-open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

const messageField = document.querySelector('#contact-message');
const charCount = document.querySelector('.char-count');
const charLimit = 500;

function updateCharCount(length) {
    if (!charCount) return;
    charCount.textContent = `${length} / ${charLimit}`;
    charCount.classList.toggle('over-limit', length > charLimit);
}

if (messageField && charCount) {
    updateCharCount(messageField.value.length);

    messageField.addEventListener('input', (event) => {
        updateCharCount(event.target.value.length);
    });
}

const contactForm = document.querySelector('.contact-form');
const successMessage = document.querySelector('.form-success');

function showError(errorEl, message) {
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }
}

function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
}

function showSuccess() {
    if (contactForm) {
        contactForm.style.display = 'none';
        if (successMessage) {
            successMessage.classList.add('visible');
        }
    }
}

if (contactForm) {
    const nameInput = contactForm.querySelector('#contact-name');
    const emailInput = contactForm.querySelector('#contact-email');
    const messageInput = contactForm.querySelector('#contact-message');
    const nameError = contactForm.querySelector('#name-error');
    const emailError = contactForm.querySelector('#email-error');
    const messageError = contactForm.querySelector('#message-error');

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrors();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        let isValid = true;

        if (!name) {
            showError(nameError, 'Name is required.');
            isValid = false;
        }

        if (!email) {
            showError(emailError, 'Email is required.');
            isValid = false;
        } else if (!email.includes('@') || !email.includes('.')) {
            showError(emailError, 'Enter a valid email address.');
            isValid = false;
        }

        if (!message) {
            showError(messageError, 'Message is required.');
            isValid = false;
        } else if (message.length > 500) {
            showError(messageError, 'Message must be 500 characters or fewer.');
            isValid = false;
        }

        if (!isValid) return;

        contactForm.reset();
        updateCharCount(0);
        showSuccess();
    });

    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim()) {
            nameError.textContent = '';
            nameError.classList.remove('visible');
        }
    });

    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        if (email.includes('@') && email.includes('.')) {
            emailError.textContent = '';
            emailError.classList.remove('visible');
        } else if (emailError.classList.contains('visible')) {
            showError(emailError, email ? 'Enter a valid email address.' : 'Email is required.');
        }
    });

    messageInput.addEventListener('input', () => {
        const message = messageInput.value.trim();
        if (message && message.length <= charLimit) {
            messageError.textContent = '';
            messageError.classList.remove('visible');
        } else if (messageError.classList.contains('visible')) {
            showError(messageError, message ? 'Message must be 500 characters or fewer.' : 'Message is required.');
        }
    });
}

const resetBtn = document.querySelector('.btn-reset-form');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        contactForm.reset();
        contactForm.style.display = '';
        if (successMessage) successMessage.classList.remove('visible');
    });
}

const CATEGORY_KEY = 'sto-active-category';

const saved = localStorage.getItem(CATEGORY_KEY);
let activeCategory = saved ? saved : 'all';

function setActiveCategory(category) {
    activeCategory = category;
    localStorage.setItem(CATEGORY_KEY, category);
}

const filterContainer = document.querySelector('.filter-buttons');

function filterTours(category) {
    const tourCards = document.querySelectorAll('.tour-card');
    tourCards.forEach(card => {
        if (category === 'all') {
            card.style.display = '';
        } else {
            card.style.display = card.dataset.category === category ? '' : 'none';
        }
    });
}

if (filterContainer) {
    filterTours(activeCategory);
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === activeCategory);
    });

    filterContainer.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-category]');
        if (!btn) return;

        filterContainer.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        setActiveCategory(btn.dataset.category);
        filterTours(btn.dataset.category);
    });
}

document.addEventListener('click', (event) => {
    const img = event.target.closest('.tour-card-image');
    if (!img) return;

    const overlay = createOverlay(img.src, img.alt);
    document.body.appendChild(overlay);
    document.body.classList.add('no-scroll');

    overlay.querySelector('.lightbox-close').addEventListener('click', closeOverlay);
});

function createOverlay(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.className = 'lightbox-img';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.textContent = 'Close';
    closeBtn.setAttribute('aria-label', 'Close lightbox');

    overlay.append(img, closeBtn);
    return overlay;
}

function closeOverlay() {
    const overlay = document.querySelector('.lightbox-overlay');
    if (overlay) {
        overlay.remove();
        document.body.classList.remove('no-scroll');
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeOverlay();
    }
});