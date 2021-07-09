import axios from 'axios'

 
//插敘全部processid
export function getprocessid(params) {
    return axios.get("/api/Manage/EquipmentManage.ashx", {
        params: params
    })
}

//插敘全部PN
export function getpn(params) {
    return axios.get("/api/Manage/ProductManage.ashx", {
        params: params
    })
}

//查询数量
export function getsearch(params) {
    return axios.get("/api/Manage/HchartsManage.ashx", {
        params: params
    })
}

//查询
export async function  getpncount(params) {
    return await axios.get("/api/Manage/HchartsManage.ashx", {
        params: params
    })
}