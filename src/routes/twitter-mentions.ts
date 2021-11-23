import { Router } from "express";
import { twitterMentions } from "../endpoints/twitter-mentions";
import { auth } from "../middlewares/auth";

const router = Router();

/**
 * POST /twitter-mentions
 * @tag TwitterMentions
 * @security BearerAuth
 * @response 200
 * @responseContent {TwitterMention[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/twitter-mentions", auth, twitterMentions);

export default router;
