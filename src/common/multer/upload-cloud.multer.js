import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configuration
cloudinary.config({
  cloud_name: "dkwqwvemv",
  api_key: "219537978458835",
  api_secret: "yez2W1m1py_FeNhht1ppN0gAdDk", // Click 'View API Keys' above to copy your API secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images",
  },
});

const uploadCloud = multer({ storage: storage });

export default uploadCloud;
