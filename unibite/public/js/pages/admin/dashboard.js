// Admin dashboard page script

async function initAdminDashboard() {
    const summary = {
        totalPortions: document.getElementById("total-portions"),
        activeAds: document.getElementById("active-ads"),
        totalUsers: document.getElementById("total-users")
    };

    const leaderboardBody = document.getElementById("leaderboard-body");
    const apiBaseUrl = "http://localhost:3000";

    try {
        const res = await fetch(`${apiBaseUrl}/api/admin/dashboard`);
        if (!res.ok) {
            throw new Error(`Failed to load dashboard: ${res.status}`);
        }

        const data = await res.json();
        if (!data.success || !data.stats) {
            throw new Error("Invalid dashboard response");
        }

        summary.totalPortions.textContent = data.stats.total_portions;
        summary.activeAds.textContent = data.stats.active_ads;
        summary.totalUsers.textContent = data.stats.total_users;

        leaderboardBody.innerHTML = "";

        if (data.leaderboard.length === 0) {
            leaderboardBody.innerHTML = "<tr><td colspan=\"4\">No donors found</td></tr>";
            return;
        }

        data.leaderboard.forEach((donor, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${donor.name}</td>
                <td>${donor.portions}</td>
                <td>${donor.rating}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
        leaderboardBody.innerHTML = "<tr><td colspan=\"4\">Unable to load leaderboard</td></tr>";
        summary.totalPortions.textContent = "—";
        summary.activeAds.textContent = "—";
        summary.totalUsers.textContent = "—";
    }
}

initAdminDashboard();