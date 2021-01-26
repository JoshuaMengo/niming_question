
import { Notify } from 'vant';

export function getUrlCode() { // 截取url中的code方法
    var url = location.search
    // this.winUrl = url
    var theRequest = new Object()
    if (url.indexOf("?") != -1) {
        var str = url.substr(1)
        var strs = str.split("&")
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
        }
    }
    return theRequest
}

export function checkPhone(phone) {
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
        Notify({ type: "warning", message: "手机号码有误，请重填" });
        return false;
    }
}