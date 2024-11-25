import authService from "../../services/auth.service.js";
import {
  describe,
  it,
  beforeAll,
  beforeEach,
  afterEach,
  jest,
  expect,
} from "@jest/globals";
import prisma from "../prisma/init.prisma.js";

// package json trên window
// "test": "jest --coverage --watchAll",

describe(`Register`, () => {
  beforeEach(() => {
    console.log(`Chạy trước hàm it`);

    jest.spyOn(prisma.users, "create");
  });

  afterEach(() => {
    console.log(`Chạy sau hàm it`);
    jest.restoreAllMocks();
  });

  describe(`authService.register`, () => {
    it(`Case 1: Trường hợp đăng ký thành công với thông tin hợp lệ`, async () => {
      // throw new Error("Lỗi rồi nè");
      // console.log(`Hàm IT case 1 chạy`);

      // với await thì dùng mockResolvedValue
      // không có await dùng mockReturnValue
      await prisma.users.create.mockResolvedValue({
        user_id: 11,
        email: "test3123@gmail.com",
        full_name: "test",
        avatar: null,
        google_id: null,
        face_app_id: null,
        created_at: "2024-11-09T08:40:46.000Z",
        updated_at: "2024-11-09T08:40:46.000Z",
        role_id: 2,
      });

      const userNew = await authService.register({
        body: {
          email: "test@gmail.com",
          pass_word: `1234`,
          full_name: `test`,
        },
      });

      console.log({ userNew });

      expect(userNew).not.toHaveProperty("pass_word");
      expect(typeof userNew.email).toBe("string");
      expect(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(userNew.email)).toBe(
        true
      );
      if (userNew.email !== "long@gmail") {
        throw new Error("email không đúng");
      }
    });

    it(`Case 2: Nên báo lỗi nếu email đã tồn tại`, () => {
      // throw new Error("Lỗi rồi nè");
      // console.log(`Hàm IT case 2 chạy`);
    });
  });
});
