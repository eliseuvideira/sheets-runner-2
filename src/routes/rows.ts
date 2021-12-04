import { params } from "@ev-fns/validation";
import { Router } from "express";
import {
  rowsGetMany,
  rowsGetOne,
  rowsNextRowNumberGetOne,
} from "../endpoints/rows";
import { auth } from "../middlewares/auth";
import { rowsGetOneParams } from "../validations/rows";

const router = Router();

/**
 * GET /rows
 * @tag Rows
 * @security BearerAuth
 * @response 200
 * @responseContent {Row[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/rows", auth, rowsGetMany);

/**
 * GET /rows/next-row-number
 * @tag Rows
 * @security BearerAuth
 * @response 200
 * @responseContent {RowSequence} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/rows/next-row-number", auth, rowsNextRowNumberGetOne);

/**
 * GET /rows/{row_number}
 * @tag Rows
 * @security BearerAuth
 * @pathParam {integer} row_number
 * @response 200
 * @responseContent {Row} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/rows/:row_number", auth, params(rowsGetOneParams), rowsGetOne);

export default router;
