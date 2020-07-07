/********Gobal Function***********/

function _fn(id){
    return document.querySelector(id);
}
function dateFinder(val){
    const dateArr= new Date(parseInt(val)*1000).toString().split(' ');
    const time = {
        day:dateArr[0],
        month:dateArr[1],
        date:dateArr[2],
        time:dateArr[4]
    }
    return time
}
const icoArr = ["01d","01n","02d","02n","03d","03n","04d","04n","09d","09n","10d","10n","11d","11n"]
function img(code){
    let imgURL;
    if(icoArr.includes(code)==true){
            imgURL= `/icons/${code}.png`;
    }
    else{
        imgURL = `http://openweathermap.org/img/wn/${code}@2x.png`
    }
    return imgURL;
}

/*******Geo Location******/

window.addEventListener('load',getLoc);
function getLoc(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(pos=>{
            let lat = pos.coords.latitude.toFixed(2);
            let long = pos.coords.longitude.toFixed(2);
            const uri = `/weather/?&lat=${lat}&lon=${long}`;
            fetch(uri,{
                method:'POST',
            })
            .then(res=>res.json())
            .then(data=>{
                const _d= data.newData;
                console.log(_d);                              
                _fn('.header-content .city').innerHTML=_d.location;
                _fn('.header-content .temp').innerHTML= _d.current.temp.toFixed()+`<sup>&deg;</sup><img width='35' src=${img(_d.current.weather[0].icon)}></img>`;
                _fn('.header-content .desc').innerHTML= _d.current.weather[0].description;
                _fn('header.container h2').innerHTML=`${dateFinder(_d.current.dt).day},${dateFinder(_d.current.dt).month} ${dateFinder(_d.current.dt).date}`;
               _fn('.loading').style.display="none";
                _fn('.outer-wrapper').style.display ="block";

                /******AQI BTN*******/

                _fn('.aqi-btn').addEventListener('click',getAQI);
                function getAQI (){
                    const aqiURL = `https://api.openaq.org/v1/measurements?coordinates=${29.10},${75.16}&radius=5000&parameter=pm10&order_by=local&limit=1`
                    fetch(aqiURL,{
                        method:'GET',
                    })
                    .then(res=>res.json())
                    .then(aqiData=>{                        
                        const aqi= aqiData.results[0];
                        console.log(aqi);
                        _fn('.aqi-loc').innerText=aqi.location;
                        _fn('.aqi-val').innerHTML = `${aqi.value.toFixed()} <span>AQI</span><sup>pm10</sup>`;
                        _fn('.aqi-time').innerHTML = `updated at ${aqi.date.local.slice(11,16)}`;
                        _fn('.aqi-data').classList.add('show');                        
                    })
                    .catch(err=>{
                        _fn('.aqi-data').classList.add('show');
                        _fn('.aqi-loc').innerHTML = "OOPS! No official data found for your location."
                    })
                    
                }

                /******* remove .show class on aqiBTN**********/
                _fn('.fa-times').addEventListener("click",(e)=>{
                    _fn('.aqi-data').classList.remove('show');
                })

                /******Slider Temperature List*******/
                const hourlyArr = _d.hourly.slice(1,16);
                _fn('.temp-slider').innerHTML = "";
                hourlyArr.forEach((e)=>{
                    const w_icon = e.weather[0].icon;
                    _fn('.temp-slider').innerHTML +=`<div class="div-inner">
                                                        <div class="mini-div">${dateFinder(e.dt).time.slice(0,5)}</div>
                                                        <div class="mini-div"><img width='30' src=${img(w_icon)}></img></div>                                                        
                                                        <div class="mini-div">${e.temp.toFixed()}&deg;</div>
                                                    </div> `
                });
                $('.temp-slider').slick({
                    infinite: false,
                    arrows:false,
                    slidesToShow: 5,
                    slidesToScroll: 5
                });


                /******Forecast Temperature List*******/               
            
                const dataArr = _d.daily.slice(1);
                const ul = _fn('section.content ul');
                ul.innerHTML ="";
                dataArr.forEach(e=>{
                    const weatherDesc = e.weather[0].description;
                    const icon = e.weather[0].icon;
                    ul.innerHTML +=`<li>
                                        <div class="day">${dateFinder(e.dt).day}</div>
                                        <div class="detail"><img width='30' src=${img(icon)}></img>${weatherDesc}</div>
                                    </li>`
                })
            })
            .catch(err=>{
                _fn('header.container h2').innerHTML = "OOPS! Server Error, Try again."
            })
        })
    }
}  
