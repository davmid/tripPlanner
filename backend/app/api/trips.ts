import { Request, Response, Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Retrieves a list of trips
 *     description: Returns a list of all trips in the database.
 *     responses:
 *       200:
 *         description: List of trips.
 */
router.get("/trips", (req: Request, res: Response) => {
  res.json([
    { id: 1, name: "Trip to Egypt", description: "Explore the pyramids" },
    { id: 2, name: "Trip to Italy", description: "Visit Rome and Venice" },
  ]);
});

export default router;
