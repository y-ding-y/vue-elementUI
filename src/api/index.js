
import axios from 'axios'
import { param } from 'jquery'


export function UserLogin(params) {
    return axios.get("/api/User/Login", {
        params: params
    })
};

export async function SearchInfo(params) {
    return await axios.get("/api/SearchInfo", {
        params: params
    })
};

export async function AddInfo(params){
    return await axios.get("/api/AddInfo",{
        params:params
    })
};

export async function UpdateInfo(params){
    return await axios.get("/api/UpdateInfo",{
        params:params
    })
};
export async function DeleteInfo(params){
    return await axios.get("/api/DeleteInfo",{
        params:params
    })
};

export async function DownLoad(params) {
    return await axios.get("/api/DownManage", {
        params: params
    })
};

export  function DownDetail(params) {
    return  axios.get("/api/DownManage", {
        params: params
    },{responseType: 'blob'})
};

export function GetInfo(params) {
    return axios.get("/api/GetInfo", {
        params: params
    })
}

export function DownInfo(params) {
    return axios.get("/api/DownInfo", {
        params: params
    })
}

export function Highcharts(params) {
    return axios.get("/api/Highcharts", {
        params: params
    })
}

export function UploadFile(params){
    return axios.get("/api/PartsInfo/upload",{
        params: params
    })
}

 