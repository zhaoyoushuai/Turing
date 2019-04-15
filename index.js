var http = require("http")
var fs = require("fs")
var url = require('url')
var req = require('request');
http.createServer(function(request,response){
    var pathName = url.parse(request.url).pathname;
    var params = url.parse(request.url,true).query;
    var is = isStaticRequest(pathName);
    if(is){
        try{
            var data =  fs.readFileSync("./page/" + pathName);
            response.writeHead(200);
            response.write(data);
            response.end()
        }catch(e){
            response.writeHead(404);
            response.write('<html><body><h2>404 NOT FOUND</h2></body></html>');
            response.end();
        }
    }else{
        if(pathName == '/chat'){
            var data = {
                "reqType":0,
                "perception": {
                    "inputText": {
                        "text": params.text
                    },
                },
                "userInfo": {
                    "apiKey": "39fc2526a9144af8a5c98b849ff81634",
                    "userId": "410452"
                }
            };
            var content = JSON.stringify(data);
            req({
                url:'http://openapi.tuling123.com/openapi/api/v2',
                method:'POST',
                headers:{
                    "content-type":"application/json"
                },
                body:content,
            },function(error,resp,body){
                if(!error &&  resp.statusCode == 200   ){
                    var obj = (JSON.parse(body));
                    if(obj&& obj.results && obj.results.length > 0 && obj.results[0].values){
                        var head = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET","Access-Control-Allow-Headers":"x-request-width,content-type"}
                        response.writeHead(200,head);
                        response.write(JSON.stringify( obj.results[0].values));
                        response.end();
                    }
                }else{
                    response.write("{}\"text\":\"不晓得你在说什么\"");
                    response.end()
                }
            })

        }
    }
}).listen(12306)

function isStaticRequest(pathName){
    var static = ["html","js","css","jpg"];
    for(var i = 0; i < static.length ; i ++){
        if(pathName.indexOf(static[i]) == pathName.length - static[i].length&&pathName.indexOf(static[i]) != - 1 ){
            return true
        }
    }
    return false

}