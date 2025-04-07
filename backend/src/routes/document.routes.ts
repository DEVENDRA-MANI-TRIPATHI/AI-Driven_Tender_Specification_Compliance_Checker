import { Router } from "express";
import { compareDocsController } from "../controllers/document.controller";

const router = Router();

// POST /api/compare
router.post("/compare", compareDocsController);

export default router;
