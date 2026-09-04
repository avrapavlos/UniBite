export function showConfirmation(message, options = {}) {
    loadConfirmationCSS();

    const {
        title = "Are you sure?",
        confirmText = "Delete",
        cancelText = "Cancel",
        danger = true
    } = options;

    return new Promise((resolve) => {
        let el = document.getElementById("confirm-dialog");
        let backdrop = document.getElementById("confirm-backdrop");

        if (!backdrop) {
            backdrop = document.createElement("div");
            backdrop.id = "confirm-backdrop";
            document.body.appendChild(backdrop);
        }

        if (!el) {
            el = document.createElement("div");
            el.id = "confirm-dialog";
            document.body.appendChild(el);
        }

        el.innerHTML = `
            <h3 class="confirm-title">${title}</h3>
            <p class="confirm-message">${message}</p>
            <div class="confirm-actions">
                <button type="button" class="confirm-cancel">${cancelText}</button>
                <button type="button" class="confirm-accept ${danger ? "danger" : ""}">${confirmText}</button>
            </div>
        `;

        el.className = "confirm-dialog show";
        backdrop.className = "confirm-backdrop show";

        function close(result) {
            el.classList.remove("show");
            backdrop.classList.remove("show");
            cleanup();
            resolve(result);
        }

        function cleanup() {
            acceptBtn.removeEventListener("click", onAccept);
            cancelBtn.removeEventListener("click", onCancel);
            backdrop.removeEventListener("click", onCancel);
        }

        function onAccept() {
            close(true);
        }

        function onCancel() {
            close(false);
        }

        const acceptBtn = el.querySelector(".confirm-accept");
        const cancelBtn = el.querySelector(".confirm-cancel");

        acceptBtn.addEventListener("click", onAccept);
        cancelBtn.addEventListener("click", onCancel);
        backdrop.addEventListener("click", onCancel);
    });
}

function loadConfirmationCSS() {
    if (!document.querySelector('link[href="../../components/Components/Confirmation/Confirmation.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "../../components/Confirmation/Confirmation.css";
        document.head.appendChild(link);
    }
}