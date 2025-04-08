import { Router } from "express";
import {
    compareDocsController,
    uploadAndExtract
} from "../controllers/document.controller";

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

export default router;
