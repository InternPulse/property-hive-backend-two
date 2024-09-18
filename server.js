import "dotenv/config"; 

import express from 'express';
import propertyRoutes from "./api/v1/routes/propertyRoutes.js";

const app = express();


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.get("/",(req, res)=> {
    return res.send("Property Hive");
})
import routes from "./app.js";
app.use(routes); 
app.use("/api/v1/property", propertyRoutes); 

app.listen(PORT ,()=> console.log(`Server is running on PORT ${PORT}`))
