
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define base upload path
const basePath = path.join(__dirname, "../public/images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File upload request body:", req.body); // Debugging log

    let uploadPath;

    if (req.body.type === "profile") {
      uploadPath = path.join(basePath, "profile"); 
    } else {
      uploadPath = path.join(basePath, "ticket"); 
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    console.log("Saving file to:", uploadPath); // Debugging log
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    console.log("Uploading file:", file.originalname); // Debugging log
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
