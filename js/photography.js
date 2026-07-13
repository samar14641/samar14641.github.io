document.addEventListener('DOMContentLoaded', function () {
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
});
