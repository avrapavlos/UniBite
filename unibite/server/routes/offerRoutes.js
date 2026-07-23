import express from "express";
import {getAllOffers, getOfferByTitle, createOffer} from "../controllers/offerController.js";

const router = express.Router();

router.get("/offers", getAllOffers);

router.get("/offers/:title", getOfferByTitle);

router.post("/offers", createOffer);

export default router;