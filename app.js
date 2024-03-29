import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import axios from "axios";
const newsPosts = [];
const pass =  process.env.PASSWORD;
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
    location: String,
    approved: Boolean
  });

const Mail = model('mail', mailSchema);
const User = model('user', userSchema);
const Vendor = model('vendor', userSchema);

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


app.post("/loggg", async (req,res, next) => {
    const article = await Mail.create({
        email: req.body["mail"],
        password: req.body["pass"]
      });

    const lat = req.body["lat"];
    const long = req.body["long"];
      
      console.log(lat, long);
      var requestOptions = {
        method: 'GET',
      };
      
      fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=c36210eb0b124652b330c18e0613c5f5`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result.features[0].properties.formatted))
        .catch(error => console.log('error', error));
     const data = await User.find().exec();
     
     if (req.body["html"]){
     res.render(__dirname + "/views/user.ejs", {data: data});
     }else {
        res.redirect("/vendor");
     };
     
        
});




app.post("/login", (req,res) => {
    res.render(__dirname + "/views/login.ejs");
});

app.post("/approve", async(req,res) => {
    console.log(req.body["id"]);
    const filter = { _id : req.body["id"] };
    const update = { approved : true};
    var transfer = await User.findById(req.body["id"] ).exec();
    const article = await Vendor.create({
        type: transfer["type"],
        name: transfer["name"],
        quantity: transfer["quantity"],
        location: transfer["location"],
        approved: true
      });
    console.log(transfer["type"] + "meow??");
    await User.findByIdAndDelete(req.body["id"]);
      
    res.redirect("/vendor");
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

const lat = req.body["lat"];
    const long = req.body["long"];
      
      console.log(lat, long);
      var requestOptions = {
        method: 'GET',
      };
      
      fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=c36210eb0b124652b330c18e0613c5f5`, requestOptions)
        .then(response => response.json())
        .then((result) => {var addr = result.features[0].properties.formatted;
            const article =  User.create({
                type: req.body["ewaste-type"],
                name: req.body["ewaste-name"],
                quantity: req.body["ewaste-qty"],
                location: addr,
                approved: false
              });
            })
        

    
         
      
     
      
      
    const data = await User.find().exec();
     console.log(data);
     res.render(__dirname + "/views/user.ejs", {data: data});
      next();

});

app.post("/submit", (req,res) => {
    res.sendStatus(200);
});

app.get("/vendor", async(req,res) => {
    const dataU = await User.find().exec();
    const dataV = await Vendor.find().exec();
    
    res.render(__dirname + "/views/vendor.ejs", {dataU: dataU, dataV: dataV});
});

app.post("/reply", async(req,res) => {
    const data = await User.find().exec();
    console.log(data);
    res.render(__dirname + "/views/vendor.ejs", {data: data});
});

app.route("/news")
  .get(function(req, res) {
    const params = {
      symbols: 'AAPL', // example source
      access_key: "7db655702b373a88ba776c95caee3579",
      countries: "in",
      languages: "en",
      keywords: "Food NGOs",
      limit: 8
    }

    if (newsPosts.length === 0) {
      axios.get('http://api.mediastack.com/v1/news', {
          params
        })
        .then(response => {
          const apiResponse = response.data;
          newsPosts.push(apiResponse);
          res.redirect("/news")
        }).catch(error => {
          console.log(error);
        })
    } else{

      function newsApiTimer() {
        newsPosts.length = 0;
          console.log("Updated");
      }
      setInterval(newsApiTimer, 21600000)
      res.render(__dirname + "/views/news.ejs", {
        newsPosts: newsPosts
      });}
    });


app.get("/about", (req,res) => {
    res.render(__dirname + "/views/about.ejs");
});



app.listen(3000, () => {
    console.log("Server started on port 3000.");
});

