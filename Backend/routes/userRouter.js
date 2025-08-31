import express from "express";
import { getUserData, loginUser, logoutUser, singleUser, userRegister } from "../controllers/userControllers.js";
import {checkToken} from "../MiddleWare/authCheckMiddleware.js";
import { uploadCloud } from "../MiddleWare/cloudinaryUpload.js";

const router = express.Router();


router.post("/register",uploadCloud.single("image"),userRegister);

router.post("/login",loginUser)

router.post("/logout", logoutUser);

router.get("/UserData",getUserData)
router.get("/id",singleUser)

router.get("/checkToken",checkToken ,(req,res)=>{
    res.json({User:req.User});
} );
export default router; 