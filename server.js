// const express=require('express')
// const dotenv=require('dotenv');
// const connectDB=require('./config/db')
// dotenv.config();
// const app=express();
// // Define the PORT variable
// const PORT = process.env.PORT || 8800;
// //const userRoute=require('./routes/authRoutes')
// //connect to mongodb
// connectDB();

// //app.use(express.json());
// //app.use('/userAuth',userRoute)
// app.listen(PORT,()=>{
//     console.log("Backend server is running on port ",PORT);
    
// })
const express = require('express');
const dotenv=require('dotenv');
const path = require('path');
const session = require('express-session');

const app = express();
const connectDB=require('./config/db')
dotenv.config();
const userRoute =require('./routes/auther-route');
const adminRoute=require('./routes/admin-route');
const PORT = 3000; // Ensure there's no extra character
connectDB();
app.set('view engine', 'ejs');

app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 15 } // 15 minutes session expiry
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.set('views',[ path.resolve(__dirname, 'views/user'),
    path.resolve(__dirname, 'views/admin')]);
app.use(express.urlencoded({ extended: true }));
//app.use(express.json());
app.use(express.json());
app.use(express.static('public',{ extensions: ['html', 'htm', 'webp', 'jpg', 'jpeg', 'png'] }));
app.use(express.static(path.join(__dirname, 'public')));


 app.use('/user',userRoute);
 app.use('/admin',adminRoute);

 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
