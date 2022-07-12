const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal,newVal) =>{
    //console.log(newVal.main.temp_name)
    let temperature = tempVal.replace("{%city%}",newVal.name);
    temperature = temperature.replace("{%temp%}",newVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",newVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",newVal.main.temp_max);
    temperature = temperature.replace("{%location%}",newVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",newVal.weather[0].main);
    return temperature;
    //console.log(temperature);
}

const server = http.createServer((req,res) => {
    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Attock%20City&appid=ac89e54ccaad3fe59b93d8aa673ec717&units=metric')
        .on('data',  (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            const realTimeData = arrData.map((val) => replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
            //console.log(realTimeData);
        })
        .on('end',  (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
});

server.listen(8000,"127.0.0.1");