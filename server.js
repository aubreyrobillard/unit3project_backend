
const express = require("express")
const app = express()
app.listener(PORT, ()=>{
    console.log(`${PORT} is working`);
})
