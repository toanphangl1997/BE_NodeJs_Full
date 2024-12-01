import express from "express";
import videoController from "../controllers/video.controller.js";
import protect from "../common/middlewares/protect.middleware.js";
import checkPermission from "../common/middlewares/check-permisson.middleware.js";

const videoRouter = express.Router();

videoRouter.get("/video-list", checkPermission, videoController.listVideo);

videoRouter.use(protect);

videoRouter.get("/video-type", videoController.typeVideo);

export default videoRouter;
