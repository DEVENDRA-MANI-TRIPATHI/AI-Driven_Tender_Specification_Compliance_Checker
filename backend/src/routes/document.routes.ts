import { Router } from "express";
import {
    compareDocsController,
    uploadAndExtract,
    downloadReport
} from "../controllers/document.controller";
import { addFeedback } from "../controllers/addFeedback.controller";

import upload from "../middlewares/multer.middleware";

const router = Router();


router.post("/compare", compareDocsController);
router.post("/upload",
    upload.fields([
        { name: "referenceFile", maxCount: 1 },
        { name: "userFile", maxCount: 1 }
    ]),
    uploadAndExtract
);

router.get("/download", downloadReport);
router.post("/:comparisonId/feedback", addFeedback);

export default router;
