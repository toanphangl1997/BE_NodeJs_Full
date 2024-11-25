// mysql2 : tương tác database và lấy dữ liệu
// kết nối với database và port
import mysql2 from "mysql2";

const pool = mysql2
  .createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    port: "3307",
    database: "db_cyber_media",
    // lấy đúng thời gian cho database
    timezone: "Z",
  })
  .promise();
export default pool;
