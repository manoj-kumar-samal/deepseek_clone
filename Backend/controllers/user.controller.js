import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";


export const signup = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    try {
        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(401).json({ errors: "User already exists" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            firstname, lastname, email, password: hashPassword
        })
        await newUser.save();
        return res.status(201).json({ message: "User signup successful" })
    } catch (error) {
        console.log("Error in signup", error)
        return res.status(500).json({ errors: "Error in signup" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ errors: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(403).json({ errors: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, config.JWT_USER_PASSWORD, {
            expiresIn: "1d"
        });

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        };

        res.cookie("jwt", token, cookieOptions);

        return res.status(200).json({
            message: "User logged in successfully",
            user,
            token
        });

    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ message: "Error in Login" });
    }
};


export const logout =async (req, res) => {
    try{
        res.clearCookie("jwt");
        return res.status(201).json({message:"Loggout Succeeded"})
    }
    catch(error){
        console.log("Error in login",error)
        res.status(500).json({errors:"Error in login"})
    }
}