import express from "express";
import videoController from "../controllers/video.controller.js";
import protect from "../common/middlewares/protect.middleware.js";
import checkPermission from "../common/middlewares/check-permisson.middleware.js";

const videoRouter = express.Router();

videoRouter.use(protect);
// videoRouter.use(checkPermission)

videoRouter.get("/video-list", checkPermission, videoController.listVideo);

videoRouter.get("/video-type", videoController.typeVideo);

export default videoRouter;
