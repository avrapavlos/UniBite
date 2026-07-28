import express from "express";
import {getAllOffers, getOfferByTitle, createOffer, getUserOffers} from "../controllers/offerController.js";

const router = express.Router();

router.get("/offers", getAllOffers);

router.get("/offers/:title", getOfferByTitle);

router.post("/offers", createOffer);

router.get("/offers", getUserOffers);

export default router;