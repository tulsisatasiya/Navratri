// const multer = require("multer");

// const fs = require("fs");
// const path = require("path");

// // for storage

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     fs.mkdirSync(path.join(__dirname, "../public/images"), { recursive: true }),
//       cb(null, path.join(__dirname, "../public/images"));
//   },
//   filename: function (req, file, cb) {
//     cb(null,file.originalname);
//   },
// });

// // for upload

// const upload = multer({ storage: storage });
// module.exports =  upload ;

const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    // Determine folder based on request route or type
    if (req.baseUrl.includes("auth")) {
      uploadPath = path.join(__dirname, "../public/images/profilePic");
    } else if (req.baseUrl.includes("ticket")) {
      uploadPath = path.join(__dirname, "../public/images/ticket");
    } else if (req.baseUrl.includes("event")) {
      uploadPath = path.join(__dirname, "../public/images/event");
    } else {
      uploadPath = path.join(__dirname, "../public/images"); // Default
    }

    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

module.exports = upload;
