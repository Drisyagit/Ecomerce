const bcrypt = require('bcryptjs');
const User= require('../../model/user');
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging line

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists, use another email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
        });

        await newUser.save();
        console.log("New User Created:", newUser);

res.status(201).json({ message: "Signup successful! Check your email for verification." });


    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Error during signup", error: error.message });
    }
};




const loadRegister= async(req,res)=>{
    try{
        res.render('register')
    }catch(error){
        console.log(error.message);
    }

}



const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        if (!email || !password) {
            return res.render("login", { message: "Email and password are required" });
        }

        const userLogin = await User.findOne({ email });

        if (!userLogin) {
            return res.render("login", { message: "Incorrect email or password..." });
        }

        const passwordMatch = await bcrypt.compare(password, userLogin.password);
        
        if (!passwordMatch) {
            return res.render("login", { message: "Incorrect email or password" });
        }

        if (userLogin.isBlocked === false) {
            // ✅ Save user ID in session
            req.session.user_id = userLogin._id;

            res.redirect("/user/home");
        } else {
            return res.render("login", { alert: "User is blocked" });
        }

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).render("login", { message: "Internal Server Error" });
    }
};




const loadLogin= async(req,res)=>{
    try{
        res.render('login',{ alert: null })
    }catch(error){
        console.log(error.message);
    }

}

   


const loadHome= async(req,res)=>{
    try{
        res.render('home')
    }catch(error){
        console.log(error.message);
    }

}


    const emailVerification = async (req, res) => {
        try {
            const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 });
            res.json({ expenses });  // Wrap expenses in an object
        } catch (error) {
            res.status(500).json({ message: "Server error." });
        }
    }



    const logout = async (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.log('Session destruction error:', err);
                    return res.status(500).send("Unable to logout");
                }
    
                res.clearCookie('connect.sid', { path: '/loadUser' }); // make sure to specify path
                res.redirect('/user/loadUser'); // Redirecting to login page
            });
        } catch (error) {
            console.log('Logout error:', error.message);
            res.status(500).send("Internal Server Error");
        }
    };
    
    




    module.exports={registerUser,verifyLogin,emailVerification,loadRegister,loadLogin,loadHome,logout}