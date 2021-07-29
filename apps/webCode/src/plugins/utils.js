/*
 * 工具类方法
 */
export default {
    /*产生随机数*/
    getRandomNumFunc(n1, n2) {ansudeshii
         
        //randomNumber(5,10)
        //返回5-10的随机整数，包括5，10
        if (arguments.length === 2) {
            return Math.round(n1 + Math.random() * (n2 - n1));
        }
        //randomNumber(10)
        //返回0-10的随机整数，包括0，10
        else if (arguments.length === 1) {
            return Math.round(Math.random() * n1)
        }
        //randomNumber()
        //返回0-255的随机整数，包括0，255
        else {
            return Math.round(Math.random() * 255)
        }
    },
    toast: function (msg, timeout) {
        // layer.toastn(msg, timeout);
        // return;
        var div = $('<div id="layer-toast" style="display:none;text-align:center;position:fixed;top:50%;left:50%;width:80%;height:20px;background:rgba(0, 0, 0, 0.5);transform: translate(-50%,-50%);font-size:15px;line-height:20px;color:#fff;padding:8px;border-radius:18px;z-index:9999;">' + msg + '</div>');

        $(document.body).append(div);
        $("#layer-toast").show();
        setTimeout(function () {
            $("#layer-toast").remove();
        }, timeout || 2000);
    },
    loading: function (msg, bool) {
        // layer.toastn(msg, timeout);
        // return;
        var div = $(`
        <div 
        id="loadings"
        style="
        background-color: rgba(0, 0, 0, 0.7);
        width: 80px;
        height: 60px;
        border-radius: 10px;
        margin: 0 auto;
        position: fixed;
        top: 45vh;
        left: 50%;
        transform: translateX(-50%);
        padding-top: 15px;
        padding-bottom: 5px;
        z-index: 9999;">
            <div style="text-align: center;width:100%;">
                <i class="el-icon-loading" style="font-size:30px;color:#fff"></i>
                <p style="color: #fff;font-size:0.7rem;">`+msg+`</p>
            </div>
        </div>`);
        if(!bool){
            $("#loadings").remove()
            return
        }
        $(document.body).append(div);
        // $("#loading").show();
    },
    comfirm: function (title, message,okfunc,cancfunc,okbut,canbut) {//(title,message,okfunc)
        // layer.toastn(msg, timeout);
        // return;
        var div = $(`
        <div style="width:100vw;height:100vh;position: fixed;top:0;z-index:30000;background-color: rgba(0, 0, 0, 0.7);" id="comfirm">
        <div
        style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 300px;
        height: 220px;
        border: 1px solid #fff;
        border-radius: 15px;
        color: #fff;
        z-index: 9999;
        border-radius: 15px;">
        <div class='close'><i class="el-icon-error" style="position: absolute;top: 10px;right: 10px;"></i></div>
        <div style="position: absolute;top: 50px;width: 100%;text-align: center;font-weight: 600;font-size:16px">`+title+`</div>
        <div style="position: absolute;top: 100px;transform: translateY(-50%);width: 100%;text-align: center;font-weight: 600;">`+message+`</div>
        <div style="position: absolute;bottom:35px;width: 100%;display:flex;justify-content: space-between;">
            <div style="width: 80%;    
            height: 30px;
            line-height: 30px;
            color: #fff;
            margin-left: 15px;
            margin-right: 15px;
            text-align: center;
            border: 1px solid #fff;
            border-radius: 15px;" class="ok" >`+(okbut?okbut:'确定')+`</div>
            <div style="width: 80%;    
            height: 30px;
            line-height: 30px;
            color: #fff;
            margin-left: 15px;
            margin-right: 15px;
            text-align: center;
            border: 1px solid #fff;
            border-radius: 15px;" class='cancle' >`+(canbut?canbut:'取消')+`</div>
        </div>
        </div>
        </div>
`);
        $(document.body).append(div);

        $('.ok').on('click', function () {
            if (okfunc) {
                okfunc();
            }
            $("#comfirm").remove();
        })
        $('.cancle').on('click', function () {
            if (cancfunc) {
                cancfunc();
            }
            $("#comfirm").remove();
        })
        $('.close').on('click', function () {
            $("#comfirm").remove();
        })
    },
    decopy(obj){
        let _tmp = JSON.stringify(obj);//将对象转换为json字符串形式
        let result = JSON.parse(_tmp);//将转换而来的字符串转换为原生js对象
        return result;
        },
    

};
