const express = require('express');
const mongoose = require ('mongoose');
const fetch = require('node-fetch');
const { response } = require('express');
require('dotenv').config();

const key = process.env.API_KEY;
const cityKey =process.env.API_CITY;

const app = express();
app.listen(process.env.PORT||3000);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));



app.get('/',(req,res)=>{
   res.render('index');
})
app.post('/weather',(req,res)=>{
    const lat= req.query.lat;
    const lon = req.query.lon;
    let loc;

      /***** Fetching City******/

    const uriCity = `https://api.opencagedata.com/geocode/v1/json?key=${cityKey}&q=${lat},${lon}&limit=1`;
    fetch(uriCity,{
        method:'GET'
    })
    .then(cityRes=>cityRes.json())
    .then(cityData=>{
            loc = cityData.results[0].formatted;

            /***** Fetching weather******/
            const uri = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
            fetch(uri,{
                method:'GET'
            })
            .then(response=>response.json())
            .then(data=>{
                data.location =loc;
                res.json({newData:data});
            })
            .catch(err=>console.log(err));
    });   
       
})