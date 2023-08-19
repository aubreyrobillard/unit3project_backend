///////////////////////////////////////////////////////////// import our dependecies:
require("dotenv").config();
const {PORT = 8000, MONGODB_URL} = process.env
// import express:
const express = require('express')
// create application object:
const app = express()
// import mongoose:
const mongoose= require("mongoose")
// import cors"
const cors = require("cors")
//import morgan:
const morgan = require("morgan")

//////////////////////////////////////////////////////////////////Database connection 
mongoose.connect(MONGODB_URL)

//////////////////////////////////////////////////////////////////connectionEvent:
mongoose.connection
.on("open", ()=>console.log("conected to Mongooes"))
.on("close", ()=>console.log("Disconected to Mongooes"))
.on("error", (error)=>console.log(error))

//////////////////////////////////////////////////////////////////MODELS
const recipeSchema = new mongoose.Schema({
    name:String,
    image:String,
    ingredients:String,
    instructions:String,
    prepTime:String,
    cookingTime:String,
    author:String,
    star: String})
const Recipe = mongoose.model("Recipe", recipeSchema)

//////////////////////////////////////////////////////////////////MIDDLEWARE:
// use cors:
app.use(cors())
// use morgan:
app.use(morgan("dev"))
// express functionality to recognize incoming request object as JSON objects:
app.use(express.json())
/////////////////////////////////////////////////////////////////ROUTES 

// INDEX: get:
app.get("/", async(req, res)=>{
    try{
        const recipies = await Recipe.find({})
        res.json (recipies)

    }

    catch(error){
        res.status(400).json(error)
    }
})

// test Routes
// app.get("/", (req, res)=>{
//     res.json({hello:"worlOfZombies"})
// })


//////////////////////////////////////////////////////////////// Server PORT:
app.listen(PORT, ()=>{
    console.log(`lsitenting to port ${PORT}`);
})