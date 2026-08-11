// Admin login page script

function adminLogin() {
    const loginForm = document.getElementById("admin-login-form");
    if (!loginForm) return;

    const errorEl = document.getElementById("login-error");
    const passwordErrorEl = document.getElementById("password-error");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberBox = document.getElementById("remember-box");

    errorEl.style.display = "none";
    passwordErrorEl.style.display = "none";

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const remember = rememberBox.checked;

        if (!passwordInput.checkValidity()) {
            passwordErrorEl.style.display = "block";
            errorEl.style.display = "none";
            return;
        }

        passwordErrorEl.style.display = "none";

        const apiBaseUrl = "http://localhost:3000";

        try {
            const res = await fetch(`${apiBaseUrl}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                errorEl.textContent = `Login failed (${res.status})`;
                errorEl.style.display = "block";
                return;
            }

            const data = await res.json();

            if (data.success) {
                // Optionally check for admin flag on the returned user (if backend provides it)
                if (remember) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                }

                // Redirect to admin dashboard (create this page separately)
                window.location.replace("../../pages/admin/dashboard.html");
            } else {
                errorEl.textContent = data.message || "Invalid credentials";
                errorEl.style.display = "block";
            }
        } catch (err) {
            console.error("Admin login error:", err);
            errorEl.textContent = "Network or server error";
            errorEl.style.display = "block";
        }
    });
}

function initAdminLogin() {
    adminLogin();
}

initAdminLogin();