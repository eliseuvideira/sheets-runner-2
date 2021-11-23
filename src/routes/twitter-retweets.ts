import { Router } from "express";
import { twitterRetweets } from "../endpoints/twitter-retweets";
import { auth } from "../middlewares/auth";

const router = Router();

/**
 * POST /twitter-retweets
 * @tag TwitterRetweets
 * @security BearerAuth
 * @response 200
 * @responseContent {TwitterRetweetResponse} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/twitter-retweets", auth, twitterRetweets);

export default router;
