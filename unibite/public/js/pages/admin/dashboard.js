async function initAdminDashboard() {
    const summary = {
        totalPortions: document.getElementById("total-portions"),
        activeAds: document.getElementById("active-ads"),
        totalUsers: document.getElementById("total-users")
    };

    const leaderboardBody = document.getElementById("leaderboard-body");
    const topDonorName = document.getElementById("top-donor-name");
    const topDonorPortions = document.getElementById("top-donor-portions");
    const highestRatedMealsBody = document.getElementById("highest-rated-meals-body");
    const apiBaseUrl = "http://localhost:3000";
    const storedAdmin = localStorage.getItem("admin") || sessionStorage.getItem("admin");

    if (!storedAdmin) {
        window.location.replace("../../pages/admin/login.html");
        return;
    }

    let admin;
    try {
        admin = JSON.parse(storedAdmin);
    } catch (err) {
        localStorage.removeItem("admin");
        sessionStorage.removeItem("admin");
        window.location.replace("../../pages/admin/login.html");
        return;
    }

    try {
        const res = await fetch(`${apiBaseUrl}/api/admin/dashboard`, {
            headers: { Authorization: `Bearer ${admin.token}` }
        });
        if (res.status === 401) {
            localStorage.removeItem("admin");
            sessionStorage.removeItem("admin");
            window.location.replace("../../pages/admin/login.html");
            return;
        }
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

        if (data.topDonor) {
            topDonorName.textContent = data.topDonor.name;
            topDonorPortions.textContent = `${data.topDonor.portions} portions shared`;
        } else {
            topDonorName.textContent = "No donor data";
            topDonorPortions.textContent = "0 portions shared";
        }

        leaderboardBody.innerHTML = "";

        if (data.leaderboard.length === 0) {
            leaderboardBody.innerHTML = "<tr><td colspan=\"4\">No donors found</td></tr>";
            return;
        }

        data.leaderboard.forEach((donor, index) => {
            const row = document.createElement("tr");
            [index + 1, donor.name, donor.portions].forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            leaderboardBody.appendChild(row);
        });

        highestRatedMealsBody.innerHTML = "";
        if (data.highestRatedMeals.length === 0) {
            highestRatedMealsBody.innerHTML = "<tr><td colspan=\"4\">No rated meals found</td></tr>";
            return;
        }

        data.highestRatedMeals.forEach((meal) => {
            const row = document.createElement("tr");
            [meal.title, meal.donorName, `${meal.averageRating}/5`, meal.ratingCount].forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            highestRatedMealsBody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
        leaderboardBody.innerHTML = "<tr><td colspan=\"4\">Unable to load leaderboard</td></tr>";
        summary.totalPortions.textContent = "—";
        summary.activeAds.textContent = "—";
        summary.totalUsers.textContent = "—";
        topDonorName.textContent = "—";
        topDonorPortions.textContent = "Unable to load donor data";
        highestRatedMealsBody.innerHTML = "<tr><td colspan=\"4\">Unable to load rated meals</td></tr>";
    }
}

initAdminDashboard();