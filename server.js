// Nodejs dùng để chạy code js trên máy tính
// Cài đặt express :B1 npm init ( enter hết)
//                  B2 npm install express

// Reload server
// Cách 1: dùng thư viện nodemon
// Cách 2: node --watch server.js

import express from "express";
import cors from "cors";

import rootRouter from "./src/routers/root.router.js";
import { handlerError } from "./src/common/helpers/error.helper.js";
import { createServer } from "node:http";
import initSocket from "./src/common/socket/init.socket.js";
import schema from "./src/common/graphql/schema.graphql.js";
import root from "./src/common/graphql/root.graphql.js";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";

const app = express();

const server = createServer(app);

// Sử dụng middleware chuyển JSON sang đối tượng JS (object,...)ádasd
app.use(express.json());
// để kết nối với tát cả localhost khác
// app.use(cors());
// để kết nối với localhost5173
app.use(
  cors({
    origin: [`http://localhost:5173`, `https://google.com`],
  })
);

app.use(express.static("."));

// Serve the GraphiQL IDE.
app.get("/ruru", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// setup grapql,tạo 2 file schema,root import file server
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.use(rootRouter);

app.use(handlerError);

initSocket(server);

const PORT = 3069;
server.listen(3069, () => {
  console.log(`Server online at port ${PORT}`);
});

// Prima
// B1: npx prisma init
// B2: npx prisma db pull => kéo table vào file schema.prisma
// B3: npx prisma generate => tạo object giống với table bên trong db

// 4 cách nhận dữ liệu
// Query Parameters
// Nhận biết bắt đầu bằng dấu chấm hỏi (?) phân tách các key với nhau bằng dấu &
// Thường dùng : phân trang, lọc, search
// app.get("/query", (req, res, next) => {
//   const query = req.query;
//   console.log(query);
//   res.json("Query Parameters");
// });

// // Patch parammeters
// // Nhận biết: dùng /: ten_bien
// // Thường dùng: khi muốn lấy dữ liệu cũ thể của một đối tượng
// app.get("/patch/:id", (req, res, next) => {
//   const params = req.params;
//   console.log(params);
//   res.json("Patch parammeters");
// });

// // Body
// // phải dùng app.use(express.json());
// // Thường dùng cho dữ liệu phức tạp,nhiều,lớn
// app.post("/body", (req, res, next) => {
//   const body = req.body;
//   console.log(body);
//   res.json(`body`);
// });

// // headers
// app.get("/headers", (req, res, next) => {
//   const headers = req.headers;
//   console.log(headers);
//   res.json("headers");
// });
