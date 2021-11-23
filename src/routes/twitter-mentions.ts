import { query } from "@ev-fns/validation";
import { Router } from "express";
import { twitterMentions } from "../endpoints/twitter-mentions";
import { auth } from "../middlewares/auth";
import { twitterMentionsQuery } from "../validations/twitter-mentions";

const router = Router();

/**
 * POST /twitter-mentions
 * @tag TwitterMentions
 * @security BearerAuth
 * @queryParam {date-time} start_date
 * @queryParam {date-time} end_date
 * @response 200
 * @responseContent {TwitterMention[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post(
  "/twitter-mentions",
  auth,
  query(twitterMentionsQuery),
  twitterMentions,
);

export default router;
