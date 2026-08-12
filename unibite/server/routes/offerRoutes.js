import express from "express";

import {
    getAllOffers,
    getOfferByTitle,
    createOffer,
    getUserOffers,
    getOfferExcludingUser
} from "../controllers/offerController.js";

import upload from "../middleware/upload.js";

const router = express.Router();


// GET all offers
router.get(
    "/offers",
    getAllOffers
);


// GET a specific offer by title
router.get(
    "/offers/:title",
    getOfferByTitle
);


// CREATE a new offer
router.post(
    "/offers",
    upload.single("image"),
    createOffer
);


// GET all offers created by a specific user
router.get(
    "/users/:userId/offers",
    getUserOffers
);

router.get(
    "/users/:userId/offers/exclude",
    getOfferExcludingUser
);


export default router;