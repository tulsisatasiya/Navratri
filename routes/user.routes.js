const express = require("express");

const upload = require("../middlewares/multerMiddleware");

const { authController } = require("../controllers");
const verifyAdmin = require("../middlewares/verifyAdmin");
const validate = require("../middlewares/validate");
const { userValidation } = require("../validation");

const router = express.Router();

//singup 
router.post("/signup",validate(userValidation.userValidationSchema),upload.single("profilePic"), authController.addUser);

//login
router.post("/login", authController.loginUser);

// router.get("/get", authController.getAllUsers);
router.get("/get", verifyAdmin, authController.getAllUsers);
router.get("/get/:search", verifyAdmin, authController.getUserByIdOrName);

//update
router.put("/update/:id",verifyAdmin,validate(userValidation.userValidationSchema), authController.updateUser); 

//delete
router.delete("/delete/:id",verifyAdmin,  authController.deleteUser);


  

module.exports = router;
