import { Router } from "express";
import { addProperty, updateProperty, deleteProperty, getAllProperty, getSingleProperty, searchAndFilter} from "../controllers/propertyController.js";
import { upload } from "../utils/multer.js";
import multer from "multer";

const router = Router();

// Routes
router.post("/properties", (req, res) => {

    // use Multer to handle images uploads, and filter images.
    upload(req, res, async (error) => {

        if (error instanceof multer.MulterError) {

            return res.status(400).json({
                statusCode: 400,
                message: `Multer Error: ${error.message}`
            })

        } else if (error) {
            
            return res.status(400).json({
                statusCode: 400,
                message: `File upload error: ${error.message}`
            });
        }

        try {
            console.log('hello world')
            await addProperty(req, res);  // Pass req and res to the controller function

        } catch (err) {

            return res.status(500).json({
                statusCode: 500,
                message: `Server Error: ${err.message}`
            });
        }

    });

});

router.put("/properties/:id", updateProperty);  // To update a property by ID
router.delete("/properties/:id", deleteProperty);  // To delete a property by ID
router.get("/properties", getAllProperty);  // To get all properties
router.get('/properties/search', searchAndFilter)
router.get("/properties/:propertyId", getSingleProperty);  // To get a single property by propertyId

export default router;