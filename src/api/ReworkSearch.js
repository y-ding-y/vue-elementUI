
import axios from 'axios'
 
//按ItemSN 查詢製程
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

 
 