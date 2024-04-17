import { Router } from "express";
import { createLine, deleteLine, getLine, getLines, updateLine, uploadCsv } from "../controllers/tasks.controller.js";

const router = Router();

router.get('/lines/', getLines)

router.get('/line/:fecha', getLine)

// router.post('/line', createLine)

router.put('/ctoborne/:id', updateLine)

router.post('/uploadcsv', uploadCsv)
// router.delete('/line/:id', deleteLine)

export default router;