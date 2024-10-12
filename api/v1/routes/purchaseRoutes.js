import { Router } from "express";
import { purchaseProperty } from "../controllers/purchaseController.js";



const purchaseRouter = Router();

purchaseRouter.post('/purchase', purchaseProperty);

export default purchaseRouter;