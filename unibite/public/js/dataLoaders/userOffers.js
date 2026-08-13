// Function to load user offers data from the API
export async function loadUserOffers(userId) {
    const currentUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
    const activeUserId = userId ?? currentUser?.id;

    if (!activeUserId) {
        console.warn("No user is logged in; skipping user offers load.");
        return [];
    }

    try {
        const response = await fetch(`http://localhost:3000/api/users/${activeUserId}/offers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load user offers");
        }

        const userOffers = await response.json();
        console.log("User offers data loaded:", userOffers);
        return userOffers;
    } catch (error) {
        console.error("Error loading user offers:", error);
        return [];
    }
} 