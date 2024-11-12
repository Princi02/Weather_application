const http = require('http');
const fs = require("fs");
const homeFile = fs.readFileSync("home.html", "utf-8");
var requests = require("requests");

const replaceVal = (tempVal, orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
    return temperature;
}
const server =http.createServer((req,res)=>{
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=pune&appid=18669233d8b5f5df5019e0e51ce42baa")
        .on("data",(chunk) => {
            const objdata = JSON.parse(chunk);  //converting data to object
            const arrData = [objdata];   // converting data to array
            // console.log(arrData[0].main.temp);
            // for many arrays -->map method
            // to convert the data into string --> we use .join
            const realTimeData = arrData.map((val) =>
                // console.log(val.main);
                replaceVal(homeFile, val)).join("");

            // console.log(realTimeData);
            
            res.write(realTimeData);
        })
        .on("end", (err) => {
            if(err) return console.log("connection closed due to errors", err);
            console.log("end");
            res.end();
        });
    }
});

server.listen(8000, "127.0.0.1");