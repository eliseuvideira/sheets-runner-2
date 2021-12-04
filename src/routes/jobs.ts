import { params } from "@ev-fns/validation";
import { Router } from "express";
import { jobsGetMany, jobsGetOne } from "../endpoints/jobs";
import { auth } from "../middlewares/auth";
import { jobsGetOneParams } from "../validations/jobs";

const router = Router();

/**
 * GET /jobs
 * @tag Jobs
 * @summary returns all recent jobs (up to two hours)
 * @security BearerAuth
 * @response 200
 * @responseContent {Job[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/jobs", auth, jobsGetMany);

/**
 * GET /jobs/{job_id}
 * @tag Jobs
 * @summary returns one of the recent jobs (up to two hours)
 * @security BearerAuth
 * @pathParam {string} job_id
 * @response 200
 * @responseContent {Job} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/jobs/:job_id", auth, params(jobsGetOneParams), jobsGetOne);

export default router;
