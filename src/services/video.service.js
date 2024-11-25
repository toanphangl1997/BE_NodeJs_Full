import prisma from "../common/prisma/init.prisma.js";
import { BadRequestError } from "../common/helpers/error.helper.js";
import pool from "../common/mysql2/pool.mysql2.js";
import videoTypeModel from "../models/video-type.model.js";

const videoService = {
  listVideo: async (req) => {
    // const [result, fields] = await pool.query("SELECT * FROM videos");

    let { page, pageSize } = req.query;

    // Đổi kiểu dữ liệu của page từ string => number
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 3;
    const totalVideo = await prisma.videos.count();
    const totalPage = Math.ceil(totalVideo / pageSize);

    console.log({ page, pageSize });

    // (page - 1) * pageSize : Công thức phân trang
    const skip = (page - 1) * pageSize;

    const videoList = await prisma.videos.findMany({
      // take như là LIMIT
      take: pageSize,
      // skip tương đương với OFFSET
      skip: skip,
      orderBy: {
        created_at: `desc`,
      },
    });
    // console.log(videoList);
    return {
      page: page,
      pageSize: pageSize,
      totalVideo: totalVideo,
      totalPage: totalPage,
      items: videoList || [],
    };
  },

  typeVideo: async () => {
    // const result = await videoTypeModel.findAll();

    const videoType = await prisma.video_type.findMany();
    // console.log(videoType);
    return videoType;
  },
};

export default videoService;
