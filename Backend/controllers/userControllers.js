import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"
export const userRegister = async (req, res) => {
  try {
    const { name, email, password, PhoneNumber } = req.body;
    const imageUrl = req.file ? req.file.path : "";

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      PhoneNumber,
    });
    await newUser.save();

    let auth = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      port: 587,
      auth: {
        user: "tanmayshukla252@gmail.com",
        pass: "tjkt aqvd lpgt wxpd",
      },
    });

    const reciver = {
      from: "tanmayshukla252@gmail.com",
      to: email,
      subject: "🎉 Welcome to Chat-App – Aapka Apna Chat-App! 🚀",
      text:
        "Hi " +
        name +
        ",\n\n" +
        "Welcome to *Chat-App*! 💬✨\n\n" +
        "Ab chatting hogi aur bhi easy, fast aur secure. Aap apne doston se connect kar sakte ho, photos & files share kar sakte ho, aur real-time masti kar sakte ho. 🔥\n\n" +
        "👉 Get started now aur banaiye apni khud ki chat duniya!\n\n" +
        "Aapka apna dostana chat partner,\n" +
        "Team Chat-App 🚀",
    };

    auth.sendMail(reciver, (error, emailresponse) => {
      if (error) {
        return console.log("Error:", error);
      }
      console.log("Message sent: %s", emailresponse.messageId);
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const userToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );

    res
      .cookie("userToken", userToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 3600000,
      })
      .send({
        message: "User logged in successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie(`userToken`, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Logout failed" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      error: "Failed to fetch users",
      details: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  console.log("Update User");
  console.log(req.body);

  try {
    const { id } = req.params;

    const imageUrl = req.file ? req.file.path : undefined;

    let updateData = { ...req.body };

    if (!updateData || Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No data provided in the request" });
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    if (imageUrl) {
      updateData.image = imageUrl;
      console.log("Updated Image:", imageUrl);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ error: "User update failed", details: err.message });
  }
};
export const singleUser = async (req, res) => {
  try {
    const singleUsers = await User.findById(req.params.id);
    if (!singleUsers) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(singleUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
