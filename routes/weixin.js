/**
 * Created by sigbit on 2017/3/27.
 */
var express = require('express');
var router = express.Router();
var API = require('wechat-api');
request = require('request');
var crypto = require('crypto');
var uuid = require('node-uuid');
var jsSHA = require('jssha');
var token = "weixin";
router.get('/', function(req, res, next) {
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;

    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = new Array(token,timestamp,nonce);
    array.sort();
    var str = array.toString().replace(/,/g,"");

    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str,'utf-8').digest("hex");

    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(code===signature){
        console.log("---true");
        res.send(echostr)
    }else{
        res.send("error");
    }
});

router.get('/loc', function(req, res, next) {

    res.render('wxloc', { title: 'wx' });
});


router.get('/access',function(req,res,next){
    var api = new API('wxb76f29f86c089754', 'fe62bbf762d6407720b529ce336bd02b');
    /*null
     { accessToken: 'bMawBdyY5idQLeX_-ODTWZVhOd51yIklU3oYPeeLTg_8BmqrmUAEEvszsKGDLconZxHOx6Nwd32W50X7ThzBWzgOCQanOeg4Vwv3xMhN7KU',
     expireTime: 1445244891114 }
     { errcode: 0, errmsg: 'ok' }*/
    api.getAccessToken(function (err, token) {
        console.log(token+"----access token get");
        res.json(token);
    });

    //var menu = JSON.stringify(require('./tsconfig.json'));
    //console.log(menu+"--22");
    //api.createMenu(menu, function (err, result) {
    //    console.log("api 43")
    //    console.log(result);
    //});
})
router.get('/ticket',function(req,res,next){
    console.log("++++++++++ticket")
    var access_token=req.query.access_token;
    console.log(access_token+"-----token tick");
    var ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi';
    request.get(ticketUrl,function(err,result,info){

        //var results=JSON.stringify(result);
        console.log(result+"---ticke result638");
        console.log(result.statusCode+"---ticke result638");
        console.log(result.body+"---ticke result639");
        var resultss=JSON.parse(result.body);
        console.log(resultss.ticket+"---ticke result631011");
        res.json(resultss);
    })
})

router.get('/signature',function(req,res,next){
    console.log("++++++++++signature")
    var jsapi_ticket=req.query.ticket;
    var timestamp=Math.ceil(new Date().getTime()/1000).toString();
    var noncestr=Math.random().toString(36).substr(2, 16);//随机字符串
    var url=req.query.url;
    //url.replace(/\//g,'%2F');
    console.log("++++++++++jsapi_ticket---"+jsapi_ticket);
    console.log("++++++++++noncesrt---"+noncestr);
    console.log("++++++++++timestamp---"+timestamp);
    console.log("++++++++++url---"+url);
    console.log("++++++++++encodeURI(url)---"+decodeURI(url));
    var str = "jsapi_ticket="+jsapi_ticket+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+decodeURI(url);
    //var sha1Code = crypto.createHash("sha1");
    //var code = sha1Code.update(str,'utf-8').digest("hex");
    //var sha1Code = crypto.createHash("sha1");
    //var code = sha1Code.update(str).digest("hex");
    console.log("------str---"+str);
    var code = crypto.createHash('sha1').update(str).digest('hex');
    console.log("------code---"+code);
    var allcode={
        s:code,
        t:timestamp,
        n:noncestr
    }
    res.json(allcode);
})


module.exports = router;
