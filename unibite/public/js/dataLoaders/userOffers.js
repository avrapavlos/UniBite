export function mergeClaimsIntoOffers(offers, claimsByOffer) {
    const normalizedClaims = claimsByOffer && typeof claimsByOffer === "object" ? claimsByOffer : {};

    return (Array.isArray(offers) ? offers : []).map((offer) => {
        const offerId = Number(offer.id ?? offer.ad_id ?? offer.offer_id);
        const offerClaims = Array.isArray(normalizedClaims[offerId]) ? normalizedClaims[offerId] : [];

        return {
            ...offer,
            claims: offerClaims
        };
    });
}

// Function to load user offers data from the API
export async function loadUserOffers(userId) {
    const currentUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
    const activeUserId = userId ?? currentUser?.id;

    if (!activeUserId) {
        console.warn("No user is logged in; skipping user offers load.");
        return [];
    }

    try {
        const [offersResponse, claimsResponse] = await Promise.all([
            fetch(`http://localhost:3000/api/users/${activeUserId}/offers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }),
            fetch(`http://localhost:3000/api/users/${activeUserId}/claims`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        ]);

        if (!offersResponse.ok) {
            throw new Error("Failed to load user offers");
        }

        const userOffers = await offersResponse.json();
        let claimsByOffer = {};

        if (claimsResponse.ok) {
            claimsByOffer = await claimsResponse.json();
        } else {
            console.warn("No claims found for this user yet.");
        }

        const mergedOffers = mergeClaimsIntoOffers(userOffers, claimsByOffer);
        console.log("User offers data loaded:", mergedOffers);
        return mergedOffers;
    } catch (error) {
        console.error("Error loading user offers:", error);
        return [];
    }
} 