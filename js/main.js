function updateNavOffset() {
    var navbar = document.getElementById('navbar');
    var toggle = document.getElementById('nav-toggle');
    if (navbar) {
        // toggle.offsetHeight is 0 whenever the toggle is display:none
        // (desktop), so this naturally reduces to just navbar.offsetHeight
        // there. On mobile the toggle is a persistent row with the
        // dropdown docked below it (see #navbar's `top` in the nav-collapse
        // media query), so the two heights stack rather than overlap.
        var toggleHeight = toggle ? toggle.offsetHeight : 0;
        var height = toggleHeight + navbar.offsetHeight;
        document.body.style.paddingTop = height + 'px';
        document.documentElement.style.setProperty('--nav-height', height + 'px');
    }
}

window.addEventListener('resize', updateNavOffset);
window.addEventListener('load', updateNavOffset);

document.addEventListener('DOMContentLoaded', function () {
    updateNavOffset();

    var navToggle = document.getElementById('nav-toggle');
    var navbarEl = document.getElementById('navbar');
    var mobileNavQuery = window.matchMedia('(max-width: 800px)');

    // Collapsing #navbar via max-height:0 only hides it visually - its
    // links stay in the tab order unless something removes them. Mark it
    // inert (unfocusable, hidden from assistive tech) whenever it's
    // actually collapsed: below the nav-collapse breakpoint AND closed.
    // Above that breakpoint the nav is always the normal visible bar, so
    // it must never be inert there regardless of the nav-open class.
    function updateNavInert() {
        if (navbarEl) {
            navbarEl.inert = mobileNavQuery.matches && !navbarEl.classList.contains('nav-open');
        }
    }

    if (navToggle && navbarEl) {
        navToggle.addEventListener('click', function () {
            var isOpen = navbarEl.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            updateNavOffset();
            updateNavInert();
        });

        // #navbar's collapse/expand is animated (transition: max-height),
        // so offsetHeight read right after toggling the class can still
        // reflect the pre-transition size. Re-check once the animation
        // actually finishes so the padding doesn't get stuck mid-transition.
        navbarEl.addEventListener('transitionend', function (event) {
            if (event.propertyName === 'max-height') {
                updateNavOffset();
            }
        });

        mobileNavQuery.addEventListener('change', updateNavInert);
        updateNavInert();
    }

    var MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    document.querySelectorAll('[data-updated]').forEach(function (el) {
        var parts = el.getAttribute('data-updated').split('-');
        var year = parts[0];
        var monthIndex = parseInt(parts[1], 10) - 1;

        el.setAttribute('data-updated-label', MONTH_NAMES[monthIndex] + ' ' + year);
    });
});
