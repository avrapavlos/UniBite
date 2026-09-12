export function showNotification(message, type = "info") {
    loadNotificationCSS();

    let el = document.getElementById("notification");
    let backdrop = document.getElementById("notification-backdrop");

    // Create backdrop if it doesn't exist
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "notification-backdrop";
        document.body.appendChild(backdrop);
        backdrop.addEventListener("click", hideNotification);
    }

    // Create the notification element if it doesn't exist
    if (!el) {
        el = document.createElement("div");
        el.id = "notification";
        document.body.appendChild(el);
        console.log("Notification element created:", el);
    }

    console.log("Showing notification:", { message, type });

    el.innerHTML = `
        <button class="notification-close">✕</button>
        <p class="notification-message">${message}</p>
    `;
    el.className = `notification ${type} show`;
    backdrop.classList.add("show");

    el.querySelector(".notification-close").addEventListener("click", hideNotification);
}

function hideNotification() {
    const el = document.getElementById("notification");
    const backdrop = document.getElementById("notification-backdrop");

    if (el) el.classList.remove("show");
    if (backdrop) backdrop.classList.remove("show");
}

function loadNotificationCSS() {
    if (!document.querySelector('link[href="../../components/Notification/Notification.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "../../components/Notification/Notification.css";
        document.head.appendChild(link);
    }
}