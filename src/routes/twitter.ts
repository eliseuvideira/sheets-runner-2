import { body, query } from "@ev-fns/validation";
import { Router } from "express";
import {
  twitterRows,
  twitterRowsAsync,
  twitterRowsCounts,
  twitterRowsCountsAsync,
  twitterRowsWriteRows,
  twitterRowsWriteRowsAsync,
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
 * @responseContent {RowsResponse} 200.application/json
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
 * @responseContent {RowsResponse} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post(
  "/twitter/write-rows",
  auth,
  body(twitterRowsWriteRowsBody),
  twitterRowsWriteRows,
);

/**
 * POST /async/twitter
 * @tag Twitter
 * @summary asynchronously fetches twitter mentions and write the rows into the google spreadsheet, a job returns before it starts the runs and can be fetched for results later and runs every 60 seconds timeout until 10 attemps are made unsuccessfully
 * @security BearerAuth
 * @queryParam {date-time} start_date
 * @queryParam {date-time} end_date
 * @response 200
 * @responseContent {Job} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/async/twitter", auth, query(twitterRowsQuery), twitterRowsAsync);

/**
 * POST /async/twitter/counts
 * @tag Twitter
 * @summary asynchronously fetches twitter counts of likes, retweets and replies for twitter rows, if none passed in the body it runs for rows that still doesn't have one of them, then writes to google spreadsheet, a job returns before it starts the runs and can be fetched for results later and runs every 60 seconds timeout until 10 attemps are made unsuccessfully
 * @security BearerAuth
 * @bodyContent {TwitterRowsCountBody} application/json
 * @response 200
 * @responseContent {Job} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post(
  "/async/twitter/counts",
  auth,
  body(twitterRowsCountsBody),
  twitterRowsCountsAsync,
);

/**
 * POST /async/twitter/write-rows
 * @tag Twitter
 * @summary asynchronously write the content of sqlite database into the google spreadsheet, in case you changed spreadsheet or lost content for a row, a job returns before it starts the runs and can be fetched for results later and runs every 60 seconds timeout until 10 attemps are made unsuccessfully
 * @security BearerAuth
 * @bodyContent {TwitterWriteRowsBody} application/json
 * @response 200
 * @responseContent {Job} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post(
  "/async/twitter/write-rows",
  auth,
  body(twitterRowsWriteRowsBody),
  twitterRowsWriteRowsAsync,
);

export default router;
