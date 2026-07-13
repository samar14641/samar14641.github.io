function updateNavOffset() {
    var navbar = document.getElementById('navbar');
    if (navbar) {
        var height = navbar.offsetHeight;
        document.body.style.paddingTop = height + 'px';
        document.documentElement.style.setProperty('--nav-height', height + 'px');
    }
}

window.addEventListener('resize', updateNavOffset);
window.addEventListener('load', updateNavOffset);

document.addEventListener('DOMContentLoaded', function () {
    updateNavOffset();

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
