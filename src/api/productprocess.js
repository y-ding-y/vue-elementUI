
import axios from 'axios'

 
//插敘全部PN
export function getpn(params) {
    return axios.get("/api/Manage/ProductManage.ashx", {
        params: params
    })
}

//按PN 查詢製程
export function getprocess(params) {
    return axios.get("/api/Manage/ProcessAddManage.ashx", {
        params: params
    })
}

//查詢製程段的名稱
export function  getstagename(params) {
    return  axios.get("/api/Manage/ProcessAddManage.ashx",{
        params: params, 
    })
}

 
 