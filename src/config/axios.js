// import axios from 'axios'

// // 配置默认的host,假如你的API host是：http://api.htmlx.club
// // var API_Back = "http://127.0.0.1:9090"

// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//     // 在发送请求之前做些什么
//     if (window.localStorage.getItem('access-token')) {
//         config.headers.Authorization = window.localStorage.getItem('access-token');
//     }
//     console.log(window.localStorage.getItem('access-token'));
//     return config
// }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error)
// });

// // 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//     // 对响应数据做点什么
//     return response
// }, function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error)
// });
