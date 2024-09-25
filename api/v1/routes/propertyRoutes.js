import { Router } from "express";
import { addProperty, updateProperty, deleteProperty, getAllProperty, getSingleProperty, searchAndFilter} from "../controllers/propertyController.js";

const router = Router();

// Routes
router.post("/properties", addProperty);  // Aligning with the properties path
router.put("/properties/:id", updateProperty);  // To update a property by ID
router.delete("/properties/:id", deleteProperty);  // To delete a property by ID
router.get("/properties", getAllProperty);  // To get all properties
router.get("/properties/:propertyId", getSingleProperty);  // To get a single property by propertyId
router.get('/properties/search', searchAndFilter)

export default router;
