import express from "express";
import { getUserData, loginUser, logoutUser, singleUser, updateUser, userRegister } from "../controllers/userControllers.js";
import {checkToken} from "../MiddleWare/authCheckMiddleware.js";
import { uploadCloud } from "../MiddleWare/cloudinaryUpload.js";

const router = express.Router();


router.post("/register",uploadCloud.single("image"),userRegister);

router.post("/login",loginUser)

router.post("/logout", logoutUser);

router.get("/UserData",checkToken,getUserData)
router.get("/id",singleUser)
router.put("/update/:id", uploadCloud.single("image"),  updateUser);

router.get("/checkToken",checkToken ,(req,res)=>{
    res.json({User:req.User});
} );
export default router; 