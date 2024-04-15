const db = require("../../config/db");

// Importing the module
const express=require("express")

// Creating express Router
const router=express.Router()

// Handling login request
router.route('/')

    .get((req,res,next)=>{
        const user_id = req.session.user_id;
        if (user_id) {
            return res.redirect("/login");
        }
        res.render("forms/login",{title:"Login Page", error:""})
    })
    .post((req,res)=>{
        const { identifiant, password } = req.body;
        db.get("SELECT * FROM admin WHERE login = ?", [identifiant], (err, row) => {
            if (err) {
                return res.render("forms/login", { title: "Login Page", error: "An error occurred" });
            }
            if (!row) {
                return res.render("forms/login", { title: "Login Page", error: "Mauvais identifiant" });
            }
            if (row.pass !== password) {
                return res.render("forms/login", { title: "Login Page", error: "Mot de passe incorrect" });
            }

            req.session.user_id = row.id;
            req.session.user = row;
            req.session.logged_in = true;
            res.redirect("/home");
        });
    })


module.exports=router
