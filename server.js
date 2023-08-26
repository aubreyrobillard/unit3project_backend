///////////////////////////////////////////////////////////// import our dependecies:
require("dotenv").config();
const { PORT = 8000, MONGODB_URL } = process.env;
// import express:
const express = require("express");
// create application object:
const app = express();
// import mongoose:
const mongoose = require("mongoose");
// import cors"
const cors = require("cors");
//import morgan:
const morgan = require("morgan");
// bcrypt for password
// const bcrypt = require('bcryptjs')
// // jsonwebtoken for json reading
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser')

//////////////////////////////////////////////////////////////////Database connection
mongoose.connect(MONGODB_URL);

//////////////////////////////////////////////////////////////////connectionEvent:
mongoose.connection
  .on("open", () => console.log("conected to Mongoose"))
  .on("close", () => console.log("Disconected to Mongoose"))
  .on("error", (error) => console.log(error));

//////////////////////////////////////////////////////////////////MODELS

// const UserSchema = new mongoose.Schema({
//     username: {
//         type: String, unique: true, required: true
//     },
//     password: {
//         type: String, required: true
//     }
// })

// const User = mongoose.model('User', UserSchema);

const recipeSchema = new mongoose.Schema({
  name: String,
  image: String,
  ingredients: String,
  instructions: String,
  prepTime: String,
  cookingTime: String,
  author: String,
  star: Number,
});
const Recipe = mongoose.model("Recipe", recipeSchema);

////////////////////////////////////////////////////////////AUTH MIDDLEWARE:
// async function authCheck(req, res, next){
//     const secret = process.env.SECRET;
//     if(req.cookies.token){
//         // if there is a cookie, try to decode
//         const payload = await jwt.verify(req.cookies.token, secret)
//         // store payload in request
//         req.payload = payload;
//         // if all good, then move on to the next bit of middleware
//         next();
//     } else {
//         // return error
//         res.status(400).json({error: "YOU ARE NOT AUTHORIZED"})
//     }
// }

//////////////////////////////////////////////////////////////////MIDDLEWARE:
// use cors:
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// use morgan:
app.use(morgan("dev"));
// express functionality to recognize incoming request object as JSON objects:
app.use(express.json());
// app.use(cookieParser());
/////////////////////////////////////////////////////////////////ROUTES

// INDEX: get:
app.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ error });
    // res.send('line 95 backend')
  }
});
// CREATE ROUTE: POST: "/""
app.post("/", async (req, res) => {
  try {
    // add username to recipe body
    // req.body.username = req.payload.username;
    // create recipe:
    const recipe = await Recipe.create(req.body);
    // send created recipe:
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error });
  }
});
//SHOW ROUTE: GET: "/"
app.get("/:id", async (req, res) => {
  try {
    id = req.params.id;
    // get a Recipe from DataBase
    const recipe = await Recipe.findById(id);
    // return a recipe as Json
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error });
  }
});

//Update Route: PUT: "/:id:
app.put("/:id", async (req, res) => {
  try {
    // update the person
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // send the updated recipe as json
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// DESTROY-> DELETE - /:id - delete a Individual Recipe:
app.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    // send deleted recipe as Json
    res.status(204).json(recipe);
  } catch (error) {
    res.status(400).json({ error });
  }
});

//////////////////////////////////////////////////////////////AUTHORIZATION ROUTES
// signup route
// app.post('/signup', async (req, res) => {
//     try{
//         // deconstruct un and pw from body
//         let { username, password } = req.body;
//         // hash out the pw (scramble it up)
//         password = await bcrypt.hash(password, await bcrypt.genSalt(15));
//         // create a user in the db
//         const user = await User.create({username, password})
//         // return user as JSON
//         res.json(user);
//     } catch(error) {
//         res.status(400).json({error})
//     }
// })

// // login route
// app.post('/login', async (req, res) => {
//     try{
//         // dconstruct un and pw
//         const {username, password} = req.body;
//         // search db for user that matches username entered in req
//         const user = await User.findOne({username})
//         // if no matching user if found, return
//         if(!user){
//             throw new Error("That username does not exist")
//         }
//         // if a user does match a username, compare them to the passwords
//         const passwordCheck = await bcrypt.compare(password, user.password)
//         // if passwords don't match, throw error
//         if(!passwordCheck){
//             throw new Error("Password is incorrect")
//         }

//         // create token with username
//         const token = jwt.sign({username: user.username}, process.env.SECRET)
//         // send a response with a cookie that includes the token
//         res.cookie("token", token, {
//             // only accessed by server requests
//             httpOnly: true,
//             //path = where the cookie is valid
//             path: '/',
//             //domain = what domain the cookie is valid on
//             domain: "localhost",
//             //secure = only send cookie over https
//             secure: false,
//             // samsite = only send cookie if the request is coming fro the same orign
//             sameSite: 'lax',
//             maxAge: 3600000, // 1 hour
//         });
//         //send the username back
//         res.json(user)
//     } catch(error) {
//         res.status(400).json({error})
//     }
// })

// // logout route to clear cookie
// app.get('/logout', (req, res) => {
//     res.clearCookie('token');
//     res.json({message: "You have been Logged Out"})
// })

//////////////////////////////////////////////////////////////// Server PORT:
app.listen(PORT, () => {
  console.log(`lsitenting to port ${PORT}`);
});
