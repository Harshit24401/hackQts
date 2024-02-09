import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.static(__dirname + '/public'));



app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("tiny"));

app.post("/submit", (req,res) => {
    console.log(req.body);
});



app.get("/", (req,res) => {
    res.render(__dirname + "/views/home.ejs");
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
