import { query } from "@ev-fns/validation";
import { Router } from "express";
import { twitterRows, twitterRowsCounts } from "../endpoints/twitter";
import { auth } from "../middlewares/auth";
import { twitterRowsQuery } from "../validations/twitter";

const router = Router();

/**
 * POST /twitter
 * @tag Twitter
 * @security BearerAuth
 * @queryParam {date-time} start_date
 * @queryParam {date-time} end_date
 * @response 200
 * @responseContent {TwitterRowsResponse} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/twitter", auth, query(twitterRowsQuery), twitterRows);

/**
 * POST /twitter/counts
 * @tag Twitter
 * @security BearerAuth
 * @response 200
 * @responseContent {TwitterCountResponse} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/twitter/counts", auth, twitterRowsCounts);

export default router;
