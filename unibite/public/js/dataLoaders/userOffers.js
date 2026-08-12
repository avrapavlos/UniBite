// Function to load user offers data from the API
export async function loadUserOffers(userId) {

    try {

        // Fetch data from json later will fetch form database
        const response = await fetch(`http://localhost:3000/api/users/${userId}/offers`, {
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

        // Return the user offers data
        return userOffers;
    } catch (error) {

        console.error("Error loading user offers:", error);
        return []; // Return an empty array in case of error
    }

} 