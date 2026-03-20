(function () {
    console.log("[MiniAdBlock] active");

    const isBadNode = (node) => {
        if (!(node instanceof HTMLElement)) return false;

        // 1. dialog open
        if (node.tagName === "DIALOG" && node.hasAttribute("open")) {
            return true;
        }

        // 2. 关键词匹配
        const keywords = ["modal", "popup", "overlay", "ads", "banner"];
        const attr = (node.id + " " + node.className).toLowerCase();

        if (keywords.some(k => attr.includes(k))) {
            return true;
        }

        // 3. 全屏遮罩
        const style = window.getComputedStyle(node);
        if (
            style.position === "fixed" &&
            parseInt(style.zIndex || 0) > 999 &&
            (style.width === "100%" || style.height === "100%")
        ) {
            return true;
        }

        return false;
    };

    const clean = (root) => {
        if (!root) return;

        if (isBadNode(root)) {
            root.remove();
            return;
        }

        root.querySelectorAll?.("*").forEach(el => {
            if (isBadNode(el)) {
                el.remove();
            }
        });
    };

    // 禁止 dialog API
    HTMLDialogElement.prototype.showModal = function () {};
    HTMLDialogElement.prototype.show = function () {};

    // 初始执行
    document.addEventListener("DOMContentLoaded", () => {
        clean(document.body);
    });

    // 监听 DOM
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => clean(node));
        }

        // 防止锁滚动
        if (document.body && document.body.style.overflow === "hidden") {
            document.body.style.overflow = "auto";
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
