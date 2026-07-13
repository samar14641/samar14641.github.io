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

    // Selected tags start EMPTY, and an empty selection means "no filter,
    // show everything" rather than "nothing matches". That makes isolating
    // a single tag one click (click it) instead of clicking every other
    // tag off first, while clicking more tags still adds them to the
    // filter (multi-select), and clicking a selected tag off - or All -
    // clears back to the unfiltered state.
    var selectedTags = [];
    var tagButtons = [];

    function applyFilter() {
        items.forEach(function (item) {
            var visible = selectedTags.length === 0 || tagsOf(item).some(function (tag) {
                return selectedTags.indexOf(tag) !== -1;
            });
            item.style.display = visible ? '' : 'none';
        });

        var noneSelected = selectedTags.length === 0;
        allBtn.classList.toggle('active', noneSelected);
        allBtn.setAttribute('aria-pressed', noneSelected ? 'true' : 'false');
    }

    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'tag-btn active';
    allBtn.textContent = 'All';
    allBtn.setAttribute('aria-pressed', 'true');

    allBtn.addEventListener('click', function () {
        selectedTags = [];

        tagButtons.forEach(function (btn) {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });

        applyFilter();
    });

    filterContainer.appendChild(allBtn);

    allTags.forEach(function (tag) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tag-btn';
        btn.textContent = tag;
        btn.setAttribute('aria-pressed', 'false');

        btn.addEventListener('click', function () {
            var index = selectedTags.indexOf(tag);
            var isSelected = index === -1;

            if (isSelected) {
                selectedTags.push(tag);
            } else {
                selectedTags.splice(index, 1);
            }

            btn.classList.toggle('active', isSelected);
            btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
            applyFilter();
        });

        tagButtons.push(btn);
        filterContainer.appendChild(btn);
    });
}
