
var wxJSSDK ={//声明微信全局变量，防止污染外部环境
    version:"1.0",//版本号
    appName:"", //使用当前库的开发者，可以配置应用名字
    isReady:false,//微信JS SDK是否初始化完毕
    access_token:"",//令牌
    ticket:"",//微信临时票据
    readySuccessCall:[],//微信初始化成功后的执行事务
    config:{
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxb76f29f86c089754', // 必填，公众号的唯一标识
        timestamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
        jsApiList: [//音频API配置列表
            "openLocation",
            "getLocation"
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    },
    /*
     函数功能：初始化
     */
    init:function() {
        if (!wx) {//验证是否存在微信的js组件
            alert("微信接口调用失败，请检查是否引入微信js！");
            return;
        }
        var that = this;//保存当前作用域，方便回调函数使用
        //获取令牌
        this.wx_get_token(function (data) {
            if (data.accessToken) {
                Cookie.Set("access_token", data.accessToken, 3600);
                that.access_token = data.accessToken;
            }
            //获取票据
            that.wx_get_ticket(function (data) {
                if (data.ticket) {
                    Cookie.Set("ticket", data.ticket, 3600);
                    that.ticket = data.ticket
                }
                //获取签名
                that.wx_get_signature(function(data){
                    that.config.signature = data.s;
                    that.config.timestamp = data.t;
                    that.config.nonceStr = data.n;
                    alert("--s--"+data.s);
                    alert("--t--"+data.t);
                    alert("--n--"+data.n);
                    that.initWx(function(){//初始化微信接口
                        //初始化完成后的执行
                    });
                });
            });

        })
    },
    //获取令牌
    wx_get_token:function(call){
        this.access_token = Cookie.Get("access_token");
        if(!Cookie.Get("access_token")){
            $.get("http://16y864037j.51mypc.cn/weixin/access", {},
                function(data){
                    call && call(data);
                },"json");
            return;
        }
        else{
        }
        call && call({});
    },
    //获取票据
    wx_get_ticket:function(call){
        this.ticket =  Cookie.Get("ticket");
        if(!this.ticket){
            $.get("http://16y864037j.51mypc.cn/weixin/ticket", {access_token: this.access_token},
                function(data){
                    call && call(data);
                },"json");
            return;
        }
        else{
        }
        call && call({});
    },
    //获取签名
    wx_get_signature:function(call){
        //var url=window.location.href;
        var url="http://16y864037j.51mypc.cn/weixin/loc";
        $.get("http://16y864037j.51mypc.cn/weixin/signature", {
                ticket: this.ticket, // 必填，生成签名的时间戳
                timestamp: this.config.timestamp, // 必填，生成签名的时间戳
                noncestr: this.config.nonceStr, // 必填，生成签名的随机串
                url: window.location.href // 必填，生成签名的随机串
            },
            function(data){
                alert(data+"---ignature");
                call && call(data);
            });
    },
    initWx:function(call, errorCall){//初始化微信接口
        var that = this;
        var conf=JSON.stringify(this.config)
        alert("---config---"+conf);
        wx.config(this.config);//初始化配置
        /*config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
         *config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
         *则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
         *则可以直接调用，不需要放在ready函数中。
         * */
        wx.ready(function(){
            that.isReady = true;
            alert("初始化成功");

            if(that.readySuccessCall.length > 0) {//成功初始化后吗，执行的事务
                $.each(that.readySuccessCall, function(i, n){
                    n();
                });
            }

            call && call();
        });
        /*config信息验证失败会执行error函数，如签名过期导致验证失败，
         *具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
         * 对于SPA可以在这里更新签名。
         * */
        wx.error(function(res){
            that.isReady = "false";
            errorCall && errorCall();
        });
    }
}
//执行初始化
wxJSSDK.init();