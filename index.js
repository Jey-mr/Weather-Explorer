import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_WEATHER = "https://api.open-meteo.com/v1/forecast";
const API_LOCATION = "https://geocode.maps.co/search"

var latitude;
var longitude;
var location;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/", async (req, res) => {
    location = req.body["input"];
    
    try{
        const resultL = await axios.get(API_LOCATION + `?q=${location}`);
        latitude = resultL.data[0].lat;
        longitude = resultL.data[0].lon;
    }catch(error){
        res.render("index.ejs", {error: "There is an error in getting location, please try again"});
    }

    try{
        const resultW = await axios.get(API_WEATHER +`?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weather = resultW.data["current_weather"];
        res.render("index.ejs", {
            city: location,
            temperature: weather.temperature
        });
    }catch(error){
        res.render("index.ejs", {error: "There is an error in getting temperature, please try again"});
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})