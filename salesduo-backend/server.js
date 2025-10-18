import express from "express";
import optimizeRoutes from "./routes/optimizeRoutes.js";
import cors from "cors";

const app = express();
app.use(cors())
app.use(express.json());
app.use("/api", optimizeRoutes); 

app.get("/", (req, res) => {
  res.send(" SalesDuo Backend is running...");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
