document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
    initTagFilters();
    initLightbox();
});

function initCarousel() {
    var slides = document.querySelectorAll('.carousel-slide');
    var dots = document.querySelectorAll('.carousel-dot');
    var caption = document.querySelector('.carousel-caption');
    var prevBtn = document.querySelector('.carousel-prev');
    var nextBtn = document.querySelector('.carousel-next');

    if (!slides.length) {
        return;
    }

    var current = 0;
    var timer = null;

    function show(index) {
        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === current);
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });

        if (caption) {
            caption.textContent = slides[current].getAttribute('data-caption') || '';
        }
    }

    function scheduleAutoAdvance() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            show(current + 1);
            scheduleAutoAdvance();
        }, 5000);
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            show(i);
            scheduleAutoAdvance();
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            show(current - 1);
            scheduleAutoAdvance();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            show(current + 1);
            scheduleAutoAdvance();
        });
    }

    show(0);
    scheduleAutoAdvance();
}

function initLightbox() {
    var grid = document.querySelector('.photo-grid');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var closeBtn = document.querySelector('.lightbox-close');

    if (!grid || !lightbox || !lightboxImg) {
        return;
    }

    function open(img) {
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) {
            lightboxCaption.textContent = img.alt;
        }
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.hidden = true;
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    grid.querySelectorAll('.photo-item img').forEach(function (img) {
        img.addEventListener('click', function () {
            open(img);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', close);
    }

    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            close();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !lightbox.hidden) {
            close();
        }
    });
}

function initTagFilters() {
    var filterContainer = document.querySelector('.tag-filters');
    var items = document.querySelectorAll('.photo-item[data-tags]');

    if (!filterContainer || !items.length) {
        return;
    }

    function tagsOf(item) {
        return item.getAttribute('data-tags').split(',').map(function (tag) {
            return tag.trim();
        }).filter(Boolean);
    }

    var allTags = [];
    items.forEach(function (item) {
        tagsOf(item).forEach(function (tag) {
            if (allTags.indexOf(tag) === -1) {
                allTags.push(tag);
            }
        });
    });

    var activeTags = allTags.slice();
    var tagButtons = [];

    function applyFilter() {
        items.forEach(function (item) {
            var visible = tagsOf(item).some(function (tag) {
                return activeTags.indexOf(tag) !== -1;
            });
            item.style.display = visible ? '' : 'none';
        });

        var allActive = activeTags.length === allTags.length;
        allBtn.classList.toggle('active', allActive);
        allBtn.setAttribute('aria-pressed', allActive ? 'true' : 'false');
    }

    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'tag-btn active';
    allBtn.textContent = 'All';
    allBtn.setAttribute('aria-pressed', 'true');

    allBtn.addEventListener('click', function () {
        var turningOn = activeTags.length !== allTags.length;
        activeTags = turningOn ? allTags.slice() : [];

        tagButtons.forEach(function (btn) {
            btn.classList.toggle('active', turningOn);
            btn.setAttribute('aria-pressed', turningOn ? 'true' : 'false');
        });

        applyFilter();
    });

    filterContainer.appendChild(allBtn);

    allTags.forEach(function (tag) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tag-btn active';
        btn.textContent = tag;
        btn.setAttribute('aria-pressed', 'true');

        btn.addEventListener('click', function () {
            var index = activeTags.indexOf(tag);
            var isActive = index === -1;

            if (isActive) {
                activeTags.push(tag);
            } else {
                activeTags.splice(index, 1);
            }

            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            applyFilter();
        });

        tagButtons.push(btn);
        filterContainer.appendChild(btn);
    });
}
