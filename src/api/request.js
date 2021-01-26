/**
 * ajax请求配置
 */
import axios from 'axios'

// import { getUrlCode } from '@/utils/index.js'
import { baselogin } from '@/api/api'

// axios默认配置
axios.defaults.timeout = 10000 // 超时时间
// axios.defaults.baseURL 请求地址前缀
// User地址
// axios.defaults.baseURL = 'http://127.0.0.1:8001'
// tools地址
// axios.defaults.baseURL = 'http://127.0.0.1:8088'
// 微服务地址
// axios.defaults.baseURL = '/api'
axios.defaults.baseURL =  process.env.NODE_ENV === 'production' ?  'http://anonymous.lodidc.cn/question/' : '/api'


// 整理数据
// axios.defaults.transformRequest = function(data) {
//     data = JSON.stringify(data)
//     return data
// }


// 路由请求拦截
axios.interceptors.request.use(
    config => {
        // config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        // config.headers['Content-Type'] = 'application/json;charset=UTF-8'

        //如果localstorage中没有session,就调用静默授权，code在重定向地址里拿
        // let session = localStorage.getItem('question_session');
        // if (!session) {
        // var url = encodeURIComponent(window.location.href);
        // var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${"wx590ea386b2de4eb8"}&redirect_uri=${'http%3a%2f%2fanonymous.lodidc.cn%2findex.html'}&response_type=code&scope=snsapi_base&state=1#wechat_redirect`;
        // window.location.href = getCodeUrl;

        // let code = getUrlCode().code
        // console.log(code)
        // debugger
        // }
        return config
    },
    error => {
        return Promise.reject(error.response)
    })

// 路由响应拦截
axios.interceptors.response.use(
    response => {
        if (response.data.success === false) {
            // return Message.error(response.data.errDesc)
            if(response.data.err_code===500){
                this.$router.go(0)
            }
        } else {
            if (response.data.err_code === 1002) {
                // 如果是session过期，调用静默授权

                var url = encodeURIComponent(window.location.href);
                var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${"wxfc6cc44785e79f4a"}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=1#wechat_redirect`;
                window.location.href = getCodeUrl;

                // 静默授权 调用接口code换取session
                // 这里是请求
                // --
            }
            return response.data
        }
    },
    error => {
        return Promise.reject(error.response) // 返回接口返回的错误信息
    })
export default axios