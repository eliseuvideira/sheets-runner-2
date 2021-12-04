import { params } from "@ev-fns/validation";
import { Router } from "express";
import {
  rowsGetMany,
  rowsGetOne,
  rowsCurrentRowNumberGetOne,
} from "../endpoints/rows";
import { auth } from "../middlewares/auth";
import { rowsGetOneParams } from "../validations/rows";

const router = Router();

/**
 * GET /rows
 * @tag Rows
 * @summary returns the content of sqlite database for rows
 * @security BearerAuth
 * @response 200
 * @responseContent {Row[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/rows", auth, rowsGetMany);

/**
 * GET /rows/current-row-number
 * @tag Rows
 * @summary returns the row number of the last written line of google spreadsheet
 * @security BearerAuth
 * @response 200
 * @responseContent {RowSequence} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/rows/current-row-number", auth, rowsCurrentRowNumberGetOne);

/**
 * GET /rows/{row_number}
 * @tag Rows
 * @summary returns the content sqlite database for a single row
 * @security BearerAuth
 * @pathParam {integer} row_number
 * @response 200
 * @responseContent {Row} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/rows/:row_number", auth, params(rowsGetOneParams), rowsGetOne);

export default router;
