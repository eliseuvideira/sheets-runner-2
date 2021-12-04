import { body, query } from "@ev-fns/validation";
import { Router } from "express";
import {
  twitterRows,
  twitterRowsCounts,
  twitterRowsWriteRows,
} from "../endpoints/twitter";
import { auth } from "../middlewares/auth";
import {
  twitterRowsCountsBody,
  twitterRowsQuery,
  twitterRowsWriteRowsBody,
} from "../validations/twitter";

const router = Router();

/**
 * POST /twitter
 * @tag Twitter
 * @summary fetches twitter mentions and write the rows into the google spreadsheet
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
 * @summary fetches twitter counts of likes, retweets and replies for twitter rows, if none passed in the body it runs for rows that still doesn't have one of them, then writes to google spreadsheet
 * @security BearerAuth
 * @bodyContent {TwitterRowsCountBody} application/json
 * @response 200
 * @responseContent {TwitterCountResponse} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post(
  "/twitter/counts",
  auth,
  body(twitterRowsCountsBody),
  twitterRowsCounts,
);

/**
 * POST /twitter/write-rows
 * @tag Twitter
 * @summary write the content of sqlite database into the google spreadsheet, in case you changed spreadsheet or lost content for a row
 * @security BearerAuth
 * @bodyContent {TwitterWriteRowsBody} application/json
 * @response 200
 * @responseContent {TwitterRowsResponse} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post(
  "/twitter/write-rows",
  auth,
  body(twitterRowsWriteRowsBody),
  twitterRowsWriteRows,
);

export default router;
