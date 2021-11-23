import { Router } from "express";
import { twitterLikes } from "../endpoints/twitter-likes";
import { auth } from "../middlewares/auth";

const router = Router();

/**
 * POST /twitter-likes
 * @tag TwitterLikes
 * @security BearerAuth
 * @response 200
 * @responseContent {TwitterLikeResponse} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/twitter-likes", auth, twitterLikes);

export default router;
