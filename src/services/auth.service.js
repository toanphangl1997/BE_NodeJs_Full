import prisma from "../common/prisma/init.prisma.js";
import {
  BadRequestError,
  UnauthorizedError,
} from "../common/helpers/error.helper.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import tokenService from "./token.service.js";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../common/constant/app.constant.js";
import { sendMail } from "../common/nodemailer/send-mail.nodemailer.js";

const authService = {
  register: async (req) => {
    // Bước 1: nhận dữ liệu từ FE
    const { email, pass_word, full_name } = req.body;
    console.log({ email, pass_word, full_name });
    // Bước 2: kiểm tra email có tồn tại trong database
    // - Nếu email tồn tại trả lỗi "Email đã tồn tại vui lòng đăng nhập"
    // - Nếu email chưa tồn tại: đi tiếp

    const userExist = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    // Trường hợp 1:
    if (userExist)
      throw new BadRequestError("Email đã tồn tại,vui lòng đăng nhập");
    console.log({ userExist });
    // Bước 3: Mã hóa password
    const hashPassword = bcrypt.hashSync(pass_word, 10);

    // Bước 4: tạo người dùng mới ( tạo dữ liệu vào trong db)
    const userNew = await prisma.users.create({
      data: {
        email: email,
        full_name: full_name,
        pass_word: hashPassword,
      },
    });

    await sendMail(email);

    return userNew;
  },
  login: async (req) => {
    // Bước 1: nhận dữ liệu từ body
    const { email, pass_word } = req.body;
    console.log(email, pass_word);
    // Bước 2: Kiểm tra email có tồn trong db hay chưa
    //         -- email tồn tại: đi tiếp
    //         -- email chưa tồn tại: trả lỗi "Email không tồn tại vui lòng đăng ký"
    const userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
      select: {
        // email : true,
        user_id: true,
        pass_word: true,
      },
    });

    if (!userExists)
      throw new BadRequestError("Email không tồn tại vui lòng đăng ký");
    // Bước 3: Kiểm tra password
    // sẽ không có pass_word bên trong userExists do đã ẩn đi ở init.prisma.js
    console.log(userExists);
    const passHash = userExists.pass_word;
    const isPassword = bcrypt.compareSync(pass_word, passHash);
    if (!isPassword) throw new BadRequestError("Mật khẩu không chính xác");
    // Bước 4:tạo accessToken (nhận vào 3 tham số) và RefreshToken
    const tokens = tokenService.createTokens(userExists);

    return tokens;
  },
  loginFacebook: async (req) => {
    const { email, id, name, picture } = req.body;
    console.log(email, id, name, picture);
    const userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
      select: {
        // email : true,
        user_id: true,
        pass_word: true,
        full_name: true,
        avatar: true,
      },
    });
    if (userExists) {
      // gom tạo 2 token ra service token
      // mang khoá bí mật ra file env
      // tạo middlware protect
      //       - tạo class lỗi UnAuthorizedError
      //       - tạo class lỗi ForbiddenError
      // => send mail chào mừng với login

      // sẽ update nếu full_name ,avatar chưa có
      await prisma.users.update({
        where: {
          user_id: userExists.user_id,
        },
        data: {
          full_name: userExists.full_name ? undefined : name,
          avatar: userExists.avatar ? undefined : picture.data.url,
        },
      });
    } else {
      await prisma.users.create({
        data: {
          face_app_id: id,
          full_name: name,
          email: email,
          avatar: picture.data.url,
        },
      });
    }
    const tokens = tokenService.createTokens(userExists);

    return tokens;
  },
  refreshToken: async (req) => {
    console.log(req.headers);
    const refreshToken = req.headers?.authorization?.split(" ")[1];
    const accessToken = req.headers["x-access-token"];

    console.log({ refreshToken, accessToken });

    if (!refreshToken) throw new UnauthorizedError();
    if (!accessToken) throw new UnauthorizedError();

    const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true,
    });

    if (decodeRefreshToken.user_id !== decodeAccessToken.user_id)
      throw new UnauthorizedError();

    const user = await prisma.users.findUnique({
      where: {
        user_id: decodeRefreshToken.user_id,
      },
    });

    const tokens = tokenService.createTokens(user);

    return tokens;
  },
  getInfo: async (req) => {
    console.log(req.user);
    return req.user;
  },
};

export default authService;
