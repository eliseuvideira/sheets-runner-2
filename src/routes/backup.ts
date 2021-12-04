import { Router } from "express";
import { backup } from "../endpoints/backup";
import { auth } from "../middlewares/auth";

const router = Router();

/**
 * POST /backup
 * @tag Backup
 * @summary remotely downloads sqlite database
 * @security BearerAuth
 * @response 200
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post("/backup", auth, backup);

export default router;
