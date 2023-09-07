import express from "express";

const router = express.Router();

router.get("/api/users/current-user", (req, res) => {
    res.send("<h1> Current user: Oliver </h1>");
});

export { router as currentUserRouter };