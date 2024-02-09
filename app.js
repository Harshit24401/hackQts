import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
 //db.js

import mongoose from "mongoose";

const url = `mongodb+srv://harora1be23:2QB9BEsU3MqMNJTQ@cluster0.7wtgnye.mongodb.net/?retryWrites=true&w=majority`;


mongoose.connect(url)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("tiny"));

app.post("/submit", (req,res) => {
    console.log(req.body);
});



app.get("/", (req,res) => {
    res.render(__dirname + "/views/login.ejs");
});

app.get("/about", (req,res) => {

});

app.get("/login", (req,res) => {

});

app.get("/user", (req,res) => {

});

app.post("/submit", (req,res) => {
    res.sendStatus(200);
});

app.get("/vendor", (req,res) => {

});





app.listen(3000, () => {
    console.log("Server started on port 3000.");
});
