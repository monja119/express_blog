// Importing express module
const express=require("express")
const db = require("../config/db");
const router=express.Router()

router.route('')
    .all((req,res,next)=>{
        res.statusCode=200;
        res.setHeader("Content-Type","text/html")
        next()
    })
    .get((req,res,next)=>{
        // verify if the user is connected
        if(req.session.logged_in)
            res.redirect("/home")
        else
            res.redirect("/login")
    })

router.route("/home")
    .all((req,res,next)=>{
        if(!req.session.logged_in)
            res.redirect("/login")
        next()
    })
    .get((req,res,next)=>{
        const user = req.session.user;
        db.all("SELECT * FROM articles order by date desc", (err, rows) => {
            let articles = err ? [] : rows;
            const data = {
                title: "Blog",
                error: "",
                user: user,
                articles: articles || [],
            };
            res.render("pages/home", data);
        });

    })


// Importing the router
module.exports=router