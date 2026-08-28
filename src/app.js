import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

//MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//ENDPOINTS

app.use("/auth", authRoutes);

export default app;