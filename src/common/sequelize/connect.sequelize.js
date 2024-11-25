import { Sequelize } from "sequelize";

// sequelize : tương tác database và lấy dữ liệu ( ORM )
// kết nối với database và port
const sequelize = new Sequelize("db_cyber_media", "root", "1234", {
  host: "localhost",
  port: "3307",
  dialect: "mysql",
  // logging : false
});

// kiểm tra kết nối của sequelize với database
sequelize
  .authenticate()
  .then((res) => {
    console.log("kết nối db thành công");
  })
  .catch((err) => {
    console.log("kết nối db thất bại", err);
  });

export default sequelize;
