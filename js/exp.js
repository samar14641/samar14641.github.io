function updateTabsOffset() {
    var tabs = document.querySelector('.exp-tabs');
    if (tabs) {
        document.documentElement.style.setProperty('--tabs-height', tabs.offsetHeight + 'px');
    }
}

window.addEventListener('resize', updateTabsOffset);
window.addEventListener('load', updateTabsOffset);

document.addEventListener('DOMContentLoaded', function () {
    updateTabsOffset();

    var tabs = document.querySelectorAll('.exp-tab');
    var panels = document.querySelectorAll('.exp-panel');

    if (!tabs.length || !panels.length) {
        return;
    }

    function activate(targetId) {
        tabs.forEach(function (tab) {
            var isActive = tab.getAttribute('data-target') === targetId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panels.forEach(function (panel) {
            panel.hidden = panel.id !== targetId;
        });
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            activate(tab.getAttribute('data-target'));
        });
    });
});
