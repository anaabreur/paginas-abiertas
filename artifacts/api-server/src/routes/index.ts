import { Router, type IRouter } from "express";
import healthRouter from "./health";
import votingRouter from "./voting";
import leaderboardRouter from "./leaderboard";
import currentBookRouter from "./currentBook";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(votingRouter);
router.use(leaderboardRouter);
router.use(currentBookRouter);
router.use(adminRouter);

export default router;
