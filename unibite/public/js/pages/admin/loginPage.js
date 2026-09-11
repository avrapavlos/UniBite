// Admin login page script

function adminLogin() {
    const loginForm = document.getElementById("admin-login-form");
    if (!loginForm) return;

    const errorEl = document.getElementById("login-error");
    const passwordErrorEl = document.getElementById("password-error");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberBox = document.getElementById("remember-box");

    errorEl.hidden = true;
    passwordErrorEl.hidden = true;

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const remember = rememberBox.checked;

        if (!passwordInput.checkValidity()) {
            passwordErrorEl.hidden = false;
            errorEl.hidden = true;
            return;
        }

        passwordErrorEl.hidden = true;

        const apiBaseUrl = "http://localhost:3000";

        try {
            const res = await fetch(`${apiBaseUrl}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                errorEl.textContent = res.status === 401
                    ? "The email or password is incorrect."
                    : (data.message || "Unable to log in right now.");
                errorEl.hidden = false;
                return;
            }

            if (data.success) {
                const storage = remember ? localStorage : sessionStorage;
                storage.setItem("admin", JSON.stringify({
                    ...data.admin,
                    token: data.token
                }));
                if (remember) {
                    sessionStorage.removeItem("admin");
                } else {
                    localStorage.removeItem("admin");
                }

                window.location.replace("../../pages/admin/dashboard.html");
            } else {
                errorEl.textContent = "The email or password is incorrect.";
                errorEl.hidden = false;
            }
        } catch (err) {
            console.error("Admin login error:", err);
            errorEl.textContent = "Unable to reach the server. Please try again.";
            errorEl.hidden = false;
        }
    });
}

function initAdminLogin() {
    adminLogin();
}

initAdminLogin();