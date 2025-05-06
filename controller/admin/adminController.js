const bcrypt = require('bcryptjs');
const User= require('../../model/user');
const jwt = require("jsonwebtoken");
const loadLogin= async(req,res)=>{
    try{
        res.render('adminlogin')
    }catch(error){
        console.log(error.message);
    }

}
const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
      console.log(email,password);
        // Check if email or password is missing
        if (!email || !password) {
            return res.render("adminlogin", { message: "Email and password are required" });
        }

        // Find user in the database
        const userLogin = await User.findOne({ email });

        if (!userLogin) {
            return res.render("adminlogin", { message: "Incorrect email or password..." });
        }

        // Compare entered password with stored hashed password
        const passwordMatch = await bcrypt.compare(password, userLogin.password);
        
        if (!passwordMatch) {
            return res.render("adminlogin", { message: "Incorrect email or password" });
        }
        if(userLogin.isAdmin==true){
            req.session.admin_id = userLogin._id; 
             res.redirect("/admin/adminhome");
        }
        // Store user session (assuming you're using express-session)
        
        // Redirect to home page

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).render("adminlogin", { message: "Internal Server Error" });
    }
};


const loadHome= async(req,res)=>{
    try{
        res.render('admin-home')
    }catch(error){
        console.log(error.message);
    }

}


const loadUserlist = async (req, res) => {
    try {
        const users = await User.find({
            $or: [{ isAdmin: { $exists: false } }, { isAdmin: false }]
        }); // Fetch only regular users

       // console.log("Fetched Users:", users); // Debugging: Check if users are retrieved
        res.render('user-list', { users });  
    } catch (error) {
        console.log("Error fetching users:", error.message);
        res.status(500).send("Internal Server Error");
    }
};


const toggleBlockUser = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from request params
        const user = await User.findById(userId); // Find the user by ID

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isBlocked = !user.isBlocked; // Toggle block status
        await user.save(); // Save changes

        res.redirect('/admin/loaduselist'); // Redirect back to user list
    } catch (error) {
        console.log("Error blocking/unblocking user:", error.message);
        res.status(500).send("Internal Server Error");
    }
};

const loadCategory= async(req,res)=>{
    try{
        res.render('category')
    }catch(error){
        console.log(error.message);
    }

}
const adminLogout = (req, res) => {
    try {
        
            res.redirect('/admin/loadlogin'); // go back to login page
        }
     catch (error) {
        console.log(error.message);
    }
};
module.exports={loadLogin,verifyLogin,loadHome,loadUserlist,toggleBlockUser,loadCategory,loadCategory,adminLogout}