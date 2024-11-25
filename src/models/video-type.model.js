import sequelize from "../common/sequelize/connect.sequelize.js";
import { DataTypes } from "sequelize";

// Model : mất thời gian
const videoTypeModel = sequelize.define(
  "video_type",
  {
    type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "video_type",
    timestamps: false,
  }
);
videoTypeModel
  .sync()
  .then(() => {
    console.log("Đồng bộ table video-type thành công");
  })
  .catch((err) => {
    console.log("Đồng bộ table video-type không thành công", err);
  });

export default videoTypeModel;
