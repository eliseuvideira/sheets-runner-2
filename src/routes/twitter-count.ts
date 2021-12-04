import { Router } from "express";
import { twitterCount } from "../endpoints/twitter-count";
import { auth } from "../middlewares/auth";

const router = Router();

/**
 * POST /twitter-count
 * @tag TwitterCount
 * @security BearerAuth
 * @response 200
 * @responseContent {TwitterCountResponse} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/twitter-count", auth, twitterCount);

export default router;
