// Function to load offers data from the API
export async function loadOffers() {

    try {

        // Fetch data from json later will fetch form database
        const response = await fetch("http://localhost:3000/api/offers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        
        if (!response.ok) {
            throw new Error("Failed to load offers");
        }


        const offers = await response.json();


        console.log("Offers data loaded:", offers);

        // Return the offers data
        return offers; 

    } catch (error) {

        console.error("Error loading offers:", error);
        return []; // Return an empty array in case of error
    }

}

