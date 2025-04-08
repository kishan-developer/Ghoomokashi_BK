const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin_Model = require("../Models/adminmodel");


const register = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            displayname,
            email,
            password,
            confirmPassword,
            role,
            bio,
            location,
            website,
            socialProfile
        } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check if user already exists
        const existingUser = await Admin_Model.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new Admin_Model({
            firstname,
            lastname,
            displayname,
            email,
            password: hashedPassword,
            role,
            bio,
            location,
            website,
            socialProfile
        });

        // Save the user
        await newUser.save();

        // Success response
        res.status(201).json({ message: `User registered with email ${email}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// user login api with ( username, email , password )
const login = async (req, res) => {

    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if user exists
        const user = await Admin_Model.findOne({ email });
        console.log("User:", user);

        if (!user) {
            return res.status(401).json({ message: `User with email ${email} not found` });
        }

        
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Get Token", token });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    register,
    login
}