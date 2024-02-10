import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.static(__dirname + '/public'));
 //db.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const mailSchema = new Schema({
  email: String,
  password: String
});

const userSchema = new Schema({
    type: String,
    name: String,
    quantity: Number,
    approved: Boolean
  });

  const vendorSchema = new Schema({
    type: String,
    name: String,
    quantity: Number,
    approved: Boolean
  });

const Mail = model('mail', mailSchema);
const User = model('user', userSchema);
const Vendor = model('vendor', vendorSchema);

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
app.set('view engine', 'ejs');

app.post("/submit", (req,res) => {
    console.log(req.body);
});



app.get("/", (req,res) => {
//     
    res.render(__dirname + "/views/home.ejs");
});

app.get("/sponsor", (req,res) => {
    res.render(__dirname + "/views/sponsors.ejs")
});


app.post("/loggg", async (req,res, next) => {
    const article = await Mail.create({
        email: req.body["mail"],
        password: req.body["pass"]
      });
      
      console.log(article);
     const data = await User.find().exec();
     console.log(data);
     res.render(__dirname + "/views/user.ejs", {data: data});
        
});

app.get('/loggg',
    (req, res, next) => {
        // this route will be called at the end
        res.send('Hello World');
    }
);


app.post("/login", (req,res) => {
    res.render(__dirname + "/views/login.ejs");
});



app.get("/user", (req,res) => {
    res.render(__dirname + "/views/user.ejs");
    
});

app.post("/query", async(req,res,next) => {
    const passArticle = {
    type: req.body["ewaste-type"],
    name: req.body["ewaste-name"],
    quantity: req.body["ewaste-qty"],
    approved: false

};
    const article = await User.create({
        type: req.body["ewaste-type"],
        name: req.body["ewaste-name"],
        quantity: req.body["ewaste-qty"],
        approved: false
      });
         
      console.log(article);
     
      
      
    const data = await User.find().exec();
     console.log(data);
     res.render(__dirname + "/views/user.ejs", {data: data});
      next();

});

app.post("/submit", (req,res) => {
    res.sendStatus(200);
});

app.get("/vendor", async(req,res) => {
    const data = await User.find().exec();
    console.log(data);
    res.render(__dirname + "/views/vendor.ejs", {data: data});
});

app.post("/reply", async(req,res) => {
    const data = await User.find().exec();
    console.log(data);
    res.render(__dirname + "/views/vendor.ejs", {data: data});
});

app.get("/about", (req,res) => {
    res.render(__dirname + "/views/about.ejs");
});



app.listen(3000, () => {
    console.log("Server started on port 3000.");
});
