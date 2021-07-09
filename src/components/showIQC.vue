<template>
    <div>
        <el-card style="background-color: rgb(255, 255, 255);" v-loading.fullscreen.lock="loading">
            <el-form inline label-width="80px">
               
                <el-form-item>
                    <el-button v-bind:style="{display: showdisplay }" plain type="success" icon="el-icon-folder-opened"
                        circle @click="chose3">
                    </el-button>
                </el-form-item>
                
            </el-form>
            <div ref="cardCanvas" style="width: 100%;height: 100%;">
                <hr>
                <el-divider content-position="left">基本资料</el-divider>
                <el-form label-width="80px" inline style="background-color: rgb(255, 255, 255);">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="驗收單號">
                                <el-input style="width: 200px;" v-model="lot" @keyup.enter.native="Search_IQC2"
                                     disabled ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="進料日期">
                                <el-input style="width: 200px;" v-model="createdate" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="檢驗日期"> 
                                <el-input style="width: 200px;" v-model="endtime" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="料號">
                                <el-input style="width: 220px;" v-model="componentitem" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物料類別">
                                <el-input style="width: 200px;" v-model="componenttype1" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="小類">
                                <el-input style="width: 200px;" v-model="componenttype2" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="交貨數量">
                                <el-input style="width: 200px;" v-model="cou_iqc" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="廠商代碼">
                                <el-input style="width: 200px;" v-model="vendorcode" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="廠商名稱">
                                <el-input style="width: 200px;" v-model="vendorname" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="SIP編號">
                                <el-input style="width: 200px;" v-model="sip_no" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="SIP版本">
                                <el-input style="width: 200px;" v-model="sip_version" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="批號">
                                <el-input style="width: 200px;" v-model="sn" @keyup.enter.native="Search_IQC"
                                     disabled ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-divider content-position="left">檢驗記錄·<el-link type="danger" :underline="false"
                    @click="handle_detail">檢驗文件附檔
                </el-link></el-divider>
                <el-form label-width="80px" inline style="background-color: rgb(255, 255, 255);">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="檢驗轉換">
                                <el-radio-group v-model="level" disabled>
                                    <el-radio label="1">一般</el-radio>
                                    <el-radio label="2">加量</el-radio>
                                    <el-radio label="3">減量</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="AQL">
                                <el-input style="width: 200px;" v-model="aql" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="ACC/REJ">
                                <el-input style="width: 200px;" v-model="acc" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="24">
                            <el-table border stripe :data="tabledata" class="_table">
                                <el-table-column label="序號" prop="ItemNo" width="50px"></el-table-column>
                                <el-table-column label="項目" prop="ItemName"></el-table-column>
                                <el-table-column label="規格" prop="ItemDesc"></el-table-column>
                                <el-table-column label="單位" prop="Unit"></el-table-column>
                                <el-table-column label="下限" prop="LowLimit"></el-table-column>
                                <el-table-column label="上限" prop="HighLimit"></el-table-column>
                                <el-table-column label="抽樣數" prop="sampleqty"></el-table-column>
                                <el-table-column label="檢驗記錄" prop="record"></el-table-column>
                                <el-table-column label="檢驗工具" prop="Tool"></el-table-column>
                                <el-table-column label="檢具編號" prop="toolSN"></el-table-column>
                                <el-table-column label="判定" prop="Result"></el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-form>

                <el-divider content-position="left">判定結果</el-divider>
                <el-form label-width="80px" inline style="background-color: rgb(255, 255, 255);">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="判定結果">
                                <el-radio-group v-model="result" disabled>
                                    <el-radio label="PASS">合格</el-radio>
                                    <el-radio label="FAIL">不合格</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="缺點說明">
                                <el-input style="width:500px;" v-model="testinformation" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            &nbsp;
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="不良數">
                                <el-input style="width: 200px;" v-model="ng_num" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="不良率">
                                <el-input style="width: 200px;" v-model="ng_rate" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </div>
        </el-card>

        <el-dialog title="日期查询" :visible.sync="timevisible">
            <el-form lable-width="80px" inline>
                <el-form-item label="物料">
                    <el-select v-model="component">
                        <el-option v-for="item in componentlist" :key="item.ComponentItem" :value="item.ComponentItem"
                            :label="item.ComponentItem+'/'+item.type2">
                            {{item.ComponentItem}}/{{item.type2}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="選擇進料日期">
                    <el-date-picker v-model="first" type="datetime" placeholder="起始時間"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                    --
                    <el-date-picker v-model="second" type="datetime" placeholder="結束時間"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button icon="el-icon-search" type="primary" @click="handle_search">Search</el-button>
                    <el-button icon="el-icon-refresh" type="primary" @click="handle_refresh">Reset</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tabledata2.slice((currentpage-1)*pagesize,currentpage*pagesize)" v-loading="loading2"
                border>
                <el-table-column label="序號" align="center" width="50px">
                    <template slot-scope="scope">
                        <span v-text="getIndex(scope.$index)"> </span>
                    </template>
                </el-table-column>
                <el-table-column prop="Parameter1" label="Component PN" width="150px"></el-table-column>
                <el-table-column prop="type2" label="物料名称描述" width="250px"></el-table-column>
                <el-table-column prop="FactorySN" label="Lot" width="130px">
                    <template slot-scope="{row}">
                        <a class="el-link" @click="handle_param(row.FactorySN)">
                            {{row.FactorySN}} </a>
                    </template>
                </el-table-column>
                <el-table-column prop="Parameter6" label="IQC NO" width="120px">
                    <template slot-scope="{row}">
                        <a class="el-link" @click="handle_param(row.Parameter6)">
                            {{row.Parameter6}} </a>
                    </template>
                </el-table-column>
                <el-table-column prop="BeginDate" label="進料日期"></el-table-column>
                <el-table-column prop="EndDate" label="檢驗日期"></el-table-column>
            </el-table>

            <div style="text-align: center;margin-top:30px;">
                <el-pagination @size-change="handlesizechange" @current-change="current_change"
                    :page-sizes="[10,20,30,50]" :page-size="pagesize" layout="total,sizes,prev,pager,next,jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="detailvisible" title="文件附檔">
            <el-table :data="tabledetail" stripe border>
                <el-table-column prop="IQCNO" label="IQC編號" width="150px"></el-table-column>
                <el-table-column prop="REPORTNAME" label="文件類型" width="200px"></el-table-column>
                <el-table-column prop="REPORT_FILE" label="文件">
                    <template slot-scope="{row}">
                        <el-link :underline="false" type="primary" @click="handle_openfile(row)">{{row.REPORT_FILE}}
                        </el-link> 
                    </template>
                </el-table-column>
                <el-table-column prop="CREATEDATE" label="日期" width="180px"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import html2canvas from 'html2canvas'
    import { SearchInfo } from './../api/index.js'

    export default {
        data() {
            return {
                tabledata: [],
                sn: "",
                createdate: "",
                endtime:"",
                component: "",
                componentlist: "",
                componentitem: "",
                componenttype1: "",
                componenttype2: "",
                cou_iqc: "",
                vendorcode: "",
                vendorname: "",
                sip_no: "",
                sip_version: "",
                lot: "",
                level: "",
                aql: "",
                acc: "",
                result: "",
                testinformation: "",
                ng_num: "",
                ng_rate: "",

                search_mode: "1",//查詢條件複選框
                lot_disabled: false,
                sn_disabled: true,
                loading: false,
                timevisible: false,

                tabledata2: [],
                first: "",
                second: "",
                loading2: false,

                pagesize: 10,
                total: 0,
                currentpage: 1,
                showdisplay: "none",
                tabledetail: [],
                linkurl: "",
                detailvisible: false,
            }
        },
        watch: {
            search_mode() {
                this.handle_clear();
                if (this.search_mode == "1") {
                    this.lot_disabled = false;
                    this.sn_disabled = true;
                    this.showdisplay = "none";
                }
                else if (this.search_mode == "2") {
                    this.lot_disabled = true;
                    this.sn_disabled = false;
                    this.showdisplay = "none";
                }
                else if (this.search_mode == "3") {
                    this.lot_disabled = true;
                    this.sn_disabled = true;
                    this.timevisible = true;
                    this.showdisplay = "block";
                }
            },
        }, 
        created() {
            this.handle_component();
            var lot =  this.$route.query.sn; 
            console.log(this.$route);
            if (lot != "") {
                this.lot_disabled = true;
                    this.sn_disabled = false;
                this.sn = lot;
                this.Search_IQC();
            }
            else {

            }
        },

        methods: {
            //查询全部物料
            handle_component() {
                var params = {
                    mode: "search_componentlist"
                }
                SearchInfo(params)
                    .then(res => {
                        this.componentlist = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })
            },
            //按驗批號查詢資料
            Search_IQC() {
                var params = {
                    mode: "Search_IQC",
                    sn: this.sn
                };
                this.loading = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading = false;
                        if (res.data.total > 0) {
                            var model = res.data.rows[0];
                            this.createdate = model.begintime;
                            this.endtime=model.endtime;
                            this.componentitem = model.ComponentItem + "/" + model.type2;
                            this.componenttype1 = model.type1;
                            this.componenttype2 = model.type2;
                            this.cou_iqc = model.Parameter2;
                            this.vendorcode = model.VendorCode;
                            this.vendorname = model.VendorName;
                            this.sip_no = model.SIPNO;
                            this.sip_version = model.Reversion;
                            this.lot = model.FactorySN1;
                            this.aql = model.Parameter8;
                            this.acc = model.Parameter9;
                            this.level = model.Parameter7;
                            this.result = model.TestResult;
                            this.testinformation = model.TestInformation;
                            this.ng_num = model.Parameter10;
                            this.ng_rate = model.Parameter11;
                            this.tabledata = res.data.rows;
                        }
                        else {
                            this.$message({ message: "該批號\"" + this.sn + "\"不存在", type: "error", showClose: true });
                            this.handle_clear();
                        }
                    })
                    .catch(function (error) { console.log(error) })
            },

            //按驗收單號查詢
            Search_IQC2() {
                var params = {
                    mode: "Search_IQC2",
                    sn: this.lot
                };
                this.loading = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading = false;
                        if (res.data.total > 0) {
                            var model = res.data.rows[0];
                            this.createdate = model.begintime;
                            this.endtime=model.endtime;
                            this.componentitem = model.ComponentItem + "/" + model.type2;
                            this.componenttype1 = model.type1;
                            this.componenttype2 = model.type2;
                            this.cou_iqc = model.Parameter2;
                            this.vendorcode = model.VendorCode;
                            this.vendorname = model.VendorName;
                            this.sip_no = model.SIPNO;
                            this.sip_version = model.Reversion;
                            this.lot = model.FactorySN1;
                            this.aql = model.Parameter8;
                            this.acc = model.Parameter9;
                            this.level = model.Parameter7;
                            this.result = model.TestResult;
                            this.testinformation = model.TestInformation;
                            this.ng_num = model.Parameter10;
                            this.ng_rate = model.Parameter11;
                            this.tabledata = res.data.rows;
                            this.sn = model.FactorySN;
                        }
                        else {
                            this.$message({ message: "該驗收單號\"" + this.lot + "\"不存在", type: "error", showClose: true });
                            this.handle_clear();
                        }
                    })
                    .catch(function (error) { console.log(error) })
            },

            //清空頁面
            handle_clear() {
                this.createdate = "";
                this.endtime="";
                this.componentitem = "";
                this.componenttype1 = "";
                this.componenttype2 = "";
                this.cou_iqc = "";
                this.vendorcode = "";
                this.vendorname = "";
                this.sip_no = "";
                this.sip_version = "";
                this.lot = "";
                this.aql = "";
                this.acc = "";
                this.level = "";
                this.result = "";
                this.testinformation = "";
                this.ng_num = ""
                this.ng_rate = "";
                this.tabledata = [];
                this.sn = "";
            },

            //保存圖片
            /* 保存图片的方法（即按钮点击触发的方法） 第一个参数为需要保存的div的id名 第二个参数为保存图片的名称 */
            saveImage(divText, imgText) {
                let canvasID = this.$refs.cardCanvas
                html2canvas(canvasID)
                    .then(canvas => {
                        let dataURL = canvas.toDataURL('image/png')
                        this.dataURL = dataURL
                        this.saveFile(dataURL, "IQC查詢")
                    })
            },
            saveFile(data, filename) {
                let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
                saveLink.href = data
                saveLink.download = filename
                let event = document.createEvent('MouseEvents')
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
                saveLink.dispatchEvent(event)
            },

            handlesizechange(val) {
                this.pagesize = val;
            },

            //翻页
            current_change(val) {
                this.currentpage = val;
            },

            getIndex($index) {  //表格序号  
                return ((this.currentpage - 1) * this.pagesize + $index + 1)
            },

            handle_search() {
                var params = {
                    mode: "Search_IQCTime",
                    first: this.first,
                    second: this.second,
                    component:this.component
                }
                console.log(params);
                if (this.first == "" || this.second == "") {
                    this.$message.warning("请选择日期")
                }
                else if (this.second < this.first) {
                    this.$message.warning("结束日期不能小于起始日期");
                }
                else {
                    this.loading2 = true;
                    SearchInfo(params)
                        .then(res => {
                            this.loading2 = false;
                            this.tabledata2 = res.data.rows;
                            this.total = res.data.total;
                        })
                        .catch(function (error) { console.log(error) })
                }

            },

            handle_param(element) {
                this.handle_clear();
                if (element.substring(0, 3) == "IQC") {
                    this.lot = element;
                    setTimeout(() => {
                        this.Search_IQC2();
                    }, 1000);
                    this.timevisible = false;
                }
                else if (element.substring(0, 1) == "L") {
                    this.sn = element;
                    setTimeout(() => {
                        this.Search_IQC();
                    }, 1000);
                    this.timevisible = false;
                }
            },

            handle_refresh() {
                this.first = "";
                this.second = "";
                this.tabledata2 = [];
                this.component="";
            },

            chose3() {
                this.lot_disabled = true;
                this.sn_disabled = true;
                this.timevisible = true;
            },

              //根據驗收單號查詢附檔文件
              Search_Detail() {
                var params = {
                    mode: "search_detail",
                    lot: this.lot
                };
                SearchInfo(params)
                    .then(res => {
                        console.log(res.data);
                        this.tabledetail = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })
            },

            handle_detail() {
                this.detailvisible = true;
                this.Search_Detail();
            },

            //點擊鏈接，下載文件到本地
            handle_openfile(row) {
                window.location.href="http://10.35.7.220:8016/55/"+row.REPORT_FILE;
                // console.log(row.REPORT_FILE);
                // var params = {
                //     mode: "down_detail",
                //     file: row.REPORT_FILE
                // }
                // // let elink = document.createElement('a');
                // //  elink.href = "/api/DownManage?mode=down_detail&file=" + row.REPORT_FILE

                // // elink.download = "11" + ".xlsx";
                // // elink.click();

                // // DownDetail(params)
                // //     .then(res => {
                // //         console.log(res.data);
                // //         const blob = new Blob([res.data])
                // //         console.log(blob);
                // //         saveFile(res, 'xxx.xlsx') //这里要传入文件名以及文件后缀 
                // //     })
                // //     .catch(err => {

                // //     })  
                // DownLoad(params)
                //     .then(res => {
                //         //    this.linkurl = res.data;
                //         console.log("http://"+res.data);
                //         const ele = document.createElement('a');
                //         ele.setAttribute('href',  res.data); //设置下载文件的url地址
                //         ele.setAttribute('download', 'download');//用于设置下载文件的文件名
                //         ele.click();
                //     })
                //     .catch(function (error) { console.log(error) })
            },
        }
    }
</script>

<style scoped>
    .el-divider__text {
        background-color: rgb(255, 255, 255);
    }

    ._table {
        pointer-events: none;
    }

    ._table th {
        background-color: rgb(97, 179, 255);
        color: white
    }
</style>