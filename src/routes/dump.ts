import { Router } from "express";
import { dumpCsv } from "../endpoints/dump";
import { auth } from "../middlewares/auth";

const router = Router();

/**
 * POST /dump/csv
 * @tag Dump
 * @summary dumps the content of the rows from sqlite to a csv spreadsheet
 * @security BearerAuth
 * @response 200
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/dump/csv", auth, dumpCsv);

export default router;
