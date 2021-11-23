import { params } from "@ev-fns/validation";
import { Router } from "express";
import {
  spreadsheetRowsGetMany,
  spreadsheetRowsGetOne,
  spreadsheetRowsSequenceGetOne,
} from "../endpoints/spreadsheet-rows";
import { auth } from "../middlewares/auth";
import { spreadsheetRowsGetOneParams } from "../validations/spreadsheet-rows";

const router = Router();

/**
 * GET /spreadsheet-rows
 * @tag SpreadsheetRows
 * @security BearerAuth
 * @response 200
 * @responseContent {SpreadsheetRow[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/spreadsheet-rows", auth, spreadsheetRowsGetMany);

/**
 * GET /spreadsheet-rows/sequence
 * @tag SpreadsheetRows
 * @security BearerAuth
 * @response 200
 * @responseContent {SpreadsheetRowSequence} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/spreadsheet-rows/sequence", auth, spreadsheetRowsSequenceGetOne);

/**
 * GET /spreadsheet-rows/{row_number}
 * @tag SpreadsheetRows
 * @security BearerAuth
 * @pathParam {integer} row_number
 * @response 200
 * @responseContent {SpreadsheetRow} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get(
  "/spreadsheet-rows/:row_number",
  auth,
  params(spreadsheetRowsGetOneParams),
  spreadsheetRowsGetOne,
);

export default router;
