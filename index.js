const http=require('http');
const fs=require('fs');
let requests=require("requests");
const replaceval=((tempVal,orgVal)=>{
  let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
  temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min);
  temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max);
  temperature=temperature.replace("{%location%}",orgVal.name);
  temperature=temperature.replace("{%country%}",orgVal.sys.country);
  temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
  return temperature;

});
const homeFile = fs.readFileSync("home.html","utf-8");
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
       requests("https://api.openweathermap.org/data/2.5/weather?q=karnal&units=metric&appid=fa262247dc685cbd44b206f3d55cdea3")
       .on("data",(chunk)=>{
        const objData=JSON.parse(chunk);
        const arrData=[objData]
        // console.log(arrData[0].main.temp);
        const realTimeData=arrData.map((val)=>replaceval(homeFile,val)).join("")
        res.write(realTimeData);
       })
       .on("end",(err)=>{
         if(err) return console.log("connection closed",err);
       })
    }
})

server.listen(8000,(req,res)=>{
    console.log("server started on 8000")
})