// PWA Scroll Lock Script
(function() {
    'use strict';

    // Chỉ tinh chỉnh nhẹ overscroll trong chế độ PWA, không khóa zoom/scroll toàn trang
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true;

    function tuneScrollContainers() {
        const areas = document.querySelectorAll('.content, .sidebar, .modal-content');
        areas.forEach(area => {
            area.style.overflowY = 'auto';
            area.style.overflowX = 'hidden';
            area.style.webkitOverflowScrolling = 'touch';
            area.style.overscrollBehavior = 'contain';
        });
    }

    function init() {
        // Không chặn pinch/double-tap; giữ a11y và khả năng zoom
        // Chỉ tinh chỉnh container để giảm pull-to-refresh ngoài ý muốn
        tuneScrollContainers();
        const observer = new MutationObserver(() => tuneScrollContainers());
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('resize', tuneScrollContainers);
        window.addEventListener('orientationchange', () => setTimeout(tuneScrollContainers, 100));
        console.log('PWA Scroll Tune: active');
    }

    if (isStandalone) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})();
