const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');

// config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// secret
let secret = process.env.SECRET;
if(!secret)
    secret = crypto.randomBytes(20).toString('hex');
    process.env.SECRET = secret;
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// params
app.use(express.static('public'));

// routes
const router=require("./routes/router")
app.use("/",router)

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running,and App is listening on port "+ PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);

