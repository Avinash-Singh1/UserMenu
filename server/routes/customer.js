const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const customerController = require('../controllers/customerController');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const app = express();
router.use(cookieParser());
// db connection table 2 for User login 
mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected2"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);


const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
      const decoded = jwt.verify(token, "sdjasdbajsdbjasd");
  
      req.user = await User.findById(decoded._id);
  
      next();
    } else {
      res.redirect("/login");
    }
  };

//   router.get("/", isAuthenticated, (req, res) => {
//     res.render("logout", { name: req.user.name });
//   });

  router.get("/login", (req, res) => {
    res.render("login", { isLoginPage: true, title: 'Login', description: 'Login Page' });
  });
  router.get("/register", (req, res) => {
    res.render("register",{ isLoginPage: true, title: 'Registration', description: 'Registration Page' });
  });

  router.get("/logout", (req, res) => {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.redirect("/");
  });
  

//   login 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
        // Code that may throw an exception
        let user = await User.findOne({ email });
        console.log("Users find: ",user);
      
        if (!user) return res.redirect("/register");
      
        const isMatch = await bcrypt.compare(password, user.password);
      
        if (!isMatch)
          return res.render("login", { email, message: "Incorrect Password" });
      
        const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");
      
        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 1000),
        });
        res.redirect("/");

        
      } catch (error) {
        // Code to handle the exception
        // alert("I am IN catch block")
        res.json({status:false});
      }

   


  });
  
  //register 
  router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    let user = await User.findOne({ email });
    if (user) {
      return res.redirect("/login");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
  
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log(`${name} ${email} pass: ${hashedPassword}`);
    const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");
  
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
  });

    //register 
    router.get("/product", async (req, res) => {
        res.render("product");
    });

    router.post('/createOrder', customerController.createOrder);














/**
 *  Customer Routes 
*/
router.get('/', isAuthenticated,customerController.homepage);
router.get('/about',isAuthenticated, customerController.about);
router.get('/add',isAuthenticated, customerController.addCustomer);
router.post('/add',isAuthenticated, customerController.postCustomer);
router.get('/view/:id',isAuthenticated, customerController.view);
router.get('/edit/:id',isAuthenticated, customerController.edit);
router.put('/edit/:id',isAuthenticated, customerController.editPost);
router.delete('/edit/:id',isAuthenticated, customerController.deleteCustomer);

router.post('/search', customerController.searchCustomers);



module.exports = router;