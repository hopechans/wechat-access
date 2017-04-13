/*
 函数名称：wxJSSDK.location
 函数功能：为wxJSSDK增加界面操作服务
 参数：
    locationApi 位置API Object 配置
 */

wxJSSDK.location = function(locationApi){
    if(wxJSSDK.isReady){//wxJSSDK.isReady 查看微信JSSDK是否初始化完毕
        if(locationApi){
            locationApi.getLocation && wx.getLocation({//获取地理位置接口
                success: function (res) {
                    locationApi.getLocation.success && locationApi.getLocation.success(res);
                }
            });

            locationApi.openLocation && wx.openLocation({//使用微信内置地图查看位置接口
                latitude: locationApi.openLocation.latitude || 0, // 纬度，浮点数，范围为90 ~ -90
                longitude: locationApi.openLocation.longitude || 0, // 经度，浮点数，范围为180 ~ -180。
                name: locationApi.openLocation.name || '', // 位置名
                address: locationApi.openLocation.address || '', // 地址详情说明
                scale: locationApi.openLocation.scale || 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: locationApi.openLocation.infoUrl ||  '' // 在查看位置界面底部显示的超链接,可点击跳转
            });

        }else{
            alert("缺少配置参数");
        }
    }else{
        alert("抱歉，wx没有初始化完毕，请等待wx初始化完毕，再调用位置接口服务。");
    }

}
window.onload = function(){
    var latitude,longitude, speed ,accuracy; // 位置信息初始变量
    $("#getLocation").click(function(){//获取地理位置接口
        wxJSSDK.location({
            getLocation:{
                success:function (res) {
                    latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    $("#latitude").html(latitude);
                    longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    $("#longitude").html(longitude);
                    speed = res.speed; // 速度，以米/每秒计
                    $("#speed").html(speed);
                    accuracy = res.accuracy; // 位置精度
                    $("#accuracy").html(accuracy);
                }
            }
        });
    });

    $("#openLocation").click(function(){//使用微信内置地图查看位置接口
        if(!latitude){
            alert('请点击获取地理位置，才能看到当前的地图位置!');
            return;
        }
        wxJSSDK.location({
            openLocation:{
                latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
                name: '测试2', // 位置名
                address: '测试22', // 地址详情说明
                scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: 'www.baidu.com' // 在查看位置界面底部显示的超链接,可点击跳转
            }
        });
    });
}


