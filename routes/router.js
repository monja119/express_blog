const express=require("express")
const app=express()

// routes
const home=require("./Home.js")
const login=require("./forms/Login")
const articles=require("./articles.js")

app.use("/",home)
app.use("/login",login)
app.use("/articles", articles)
app.use("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/login")
})
app.use((req,res,next)=>{
    res.statusCode=404
    res.send("La page que vous cherchez n'existe pas")
})

// Exporting the app
module.exports=app