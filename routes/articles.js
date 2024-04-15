// Importing express module
const express=require("express")
const db = require("../config/db");
const router=express.Router()


router.route('')
    .all((req,res,next)=>{
        if(!req.session.logged_in)
            res.redirect("/login")
        next()
    })
    .get((req,res,next)=>{
        const user = req.session.user;
        const data = {
            title: "Création article",
            error: "",
            user : user,
        };
        res.render("pages/articles/create",data)
    })

    .post((req,res,next)=>{
        const { title, content } = req.body;
        const author_id = req.session.user.id;
        const date = new Date().toISOString();
        db.run("INSERT INTO articles (title, content, date, author_id) VALUES (?, ?, ?, ?)", [title, content, date, author_id], (err) => {
            if (err) {

                return res.render("pages/articles/create", {
                    title: "Création article",
                    error: err.message,
                    user: req.session.user });
            }
            res.redirect("/home");
        });
    })


router.route('/:id')
    .all((req,res,next)=>{
        if(!req.session.logged_in)
            res.redirect("/login")
        next()
    })
    .get((req,res,next)=>{
        const user = req.session.user;
        const id = req.params.id;
        db.get("SELECT * FROM articles WHERE id = ?", [id], (err, row) => {
                if (err) {
                    return res.render("pages/articles/read", {
                        title: "Lecture article",
                        error: err.message,
                        user: user,
                        article: null,
                    });
                }
                if (!row) {
                    return res.render("pages/articles/read", {
                        title: "Lecture article",
                        error: "Article non trouvé",
                        user: user,
                        article: null,
                    });
                }
                db.get("SELECT * FROM admin WHERE id = ?", [row.author_id], (err, author_data) => {
                    if (!err) {
                        res.render("pages/articles/read", {
                            title: "Article - " + row.title,
                            error: "",
                            user: user,
                            article: row,
                            author : author_data
                        });
                    }
                });
            }
        );
    })
    .delete((req,res,next)=>{
        const id = req.params.id;
        db.run("DELETE FROM articles WHERE id = ?", [id], (err) => {
            if (err) {
                return res.render("pages/articles/read", {
                    title: "Lecture article",
                    error: err.message,
                    user: req.session.user,
                    article: null,
                });
            }
            res.redirect("/home");
        });
    })
router.route('/:id')
    .all((req,res,next)=>{
        if(!req.session.logged_in)
            res.redirect("/login")
        next()
    })
    .get((req,res,next)=>{
        const user = req.session.user;
        const id = req.params.id;
        db.get("SELECT * FROM articles WHERE id = ?", [id], (err, row) => {
                if (err) {
                    return res.render("pages/articles/read", {
                        title: "Lecture article",
                        error: err.message,
                        user: user,
                        article: null,
                    });
                }
                if (!row) {
                    return res.render("pages/articles/read", {
                        title: "Lecture article",
                        error: "Article non trouvé",
                        user: user,
                        article: null,
                    });
                }
                db.get("SELECT * FROM admin WHERE id = ?", [row.author_id], (err, author_data) => {
                    if (!err) {
                        res.render("pages/articles/read", {
                            title: "Article - " + row.title,
                            error: "",
                            user: user,
                            article: row,
                            author : author_data
                        });
                    }
                });
            }
        );
    })
    .delete((req,res,next)=>{
        const id = req.params.id;
        db.get("SELECT * FROM articles WHERE id = ?", [id], (err, row) => {
            if (row.author_id !== req.session.user.id) {
                return res.send("Vous n'êtes pas autorisé à supprimer cet article ou il y a eu une erreur")
            }
            db.run("DELETE FROM articles WHERE id = ?", [id], (err) => {
                if (err) {
                    return res.render("pages/articles/read", {
                        title: "Lecture article",
                        error: err.message,
                        user: req.session.user,
                        article: null,
                    });
                }
                res.sendStatus(200)
            });
        })
    })

router.route('/edit/:id')
    .all((req,res,next)=>{
        if(!req.session.logged_in)
            res.redirect("/login")
        next()
    })
    .get((req,res,next)=>{
        const user = req.session.user;
        const id = req.params.id;
        db.get("SELECT * FROM articles WHERE id = ?", [id], (err, row) => {
                if (err) {
                    return res.render("pages/articles/read", {
                        title: "Lecture article",
                        error: err.message,
                        user: user,
                        article: null,
                    });
                }
                if (!row) {
                    return res.render("pages/articles/read", {
                        title: "Lecture article",
                        error: "Article non trouvé",
                        user: user,
                        article: null,
                    });
                }
                if (row.author_id !== user.id) {
                    return res.send("Vous n'êtes pas autorisé à modifier cet article")
                }
                db.get("SELECT * FROM admin WHERE id = ?", [row.author_id], (err, author_data) => {
                    if (!err) {
                        res.render("pages/articles/modify", {
                            title: "Article - " + row.title,
                            error: "",
                            user: user,
                            article: row,
                            author : author_data
                        });
                    }
                });
            }
        );
    })
    .post((req,res,next)=>{
        const { title, content } = req.body;
        const id = req.params.id;
        db.run("UPDATE articles SET title = ?, content = ? WHERE id = ?", [title, content, id], (err) => {
            if (err) {
                return res.render("pages/articles/modify", {
                    title: "Modification article",
                    error: err.message,
                    user: req.session.user,
                    article: null,
                });
            }
            res.redirect("/home");
        });
    })

module.exports=router