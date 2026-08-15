import express from "express";

import {
    getAllOffers,
    getOfferByTitle,
    createOffer,
    getUserOffers,
    getOfferExcludingUser,
    updateOffer,
    deleteOffer,
    claimOffer,
    getOfferClaims,
    acceptOfferClaim,
    rejectOfferClaim,
    getUserClaims,
    getUserClaimedOffers,
    rateClaim
} from "../controllers/offerController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/offers", getAllOffers);
router.get("/offers/:title", getOfferByTitle);
router.post("/offers", upload.single("image"), createOffer);

router.get("/users/:userId/offers", getUserOffers);
router.get("/users/:userId/claims", getUserClaims);
router.get("/users/:userId/claimed-offers", getUserClaimedOffers);
router.get("/users/:userId/offers/exclude", getOfferExcludingUser);
router.get("/offers/:offerId/claims", getOfferClaims);
router.post("/offers/:offerId/claims", claimOffer);
router.post("/offers/:offerId/claims/:requestId/accept", acceptOfferClaim);
router.post("/offers/:offerId/claims/:requestId/reject", rejectOfferClaim);
router.post("/requests/:requestId/rate", rateClaim);
router.post("/offers/:offerId", updateOffer);
router.delete("/offers/:offerId", deleteOffer);

export default router;