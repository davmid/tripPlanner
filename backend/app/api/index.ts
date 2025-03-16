import express from "express";
import cors from "cors";
import { setupSwagger } from "./swagger";
import tripRoutes from "./trips"; // Importujemy trasy API

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use("/api", tripRoutes);

// Start serwera
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
