<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <el-card>
                    <el-form inline label-width="80px">
                        <el-row>
                            <el-form-item label="FactorySN">
                                <el-input v-model="sn"> </el-input>
                            </el-form-item>
                            <el-form-item label="FGSN">
                                <el-input v-model="fgsn"> </el-input>
                            </el-form-item>
                            <el-form-item label="Station ID" v-loading="loading2">
                                <el-select v-model="station">
                                    <el-option v-for="item in stationlist" :key="item.StationID" :value="item.StationID"
                                        :label="item.StationDesc">
                                        {{item.StationID}}/{{item.StationDesc}}</el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="产线">
                                <el-select v-model="line">
                                    <el-option v-for="item in linelist" :label="item.LineDesc" :key="item.LineID"
                                        :value="item.LineID"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="選擇日期">
                                <el-date-picker v-model="first" type="datetime" placeholder="起始時間"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>--
                                <el-date-picker v-model="second" type="datetime" placeholder="結束時間"
                                    default-time="23:59:59" value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label=" ">
                                <el-button type="primary" icon="el-icon-search" @click="handle_search">Search
                                </el-button>
                                <el-button type="primary" icon="el-icon-refresh" @click="handle_refresh">Reset
                                </el-button>
                                <el-button type="success" icon="el-icon-download" @click="handle_download">DownLoad
                                </el-button>
                            </el-form-item>
                        </el-row>


                        <el-table :data="tabledata.slice((currentPage-1)*pagesize,currentPage*pagesize)" border
                            v-loading="loading">
                            <el-table-column prop="FactorySN" label="FactorySN" width="130px"></el-table-column>
                            <el-table-column prop="WorkerID" label="操作员" width="90px"></el-table-column>
                            <el-table-column prop="LineID" label="产线ID" width="80px"></el-table-column>
                            <el-table-column prop="TestResult" label="测试结果" width="80px"></el-table-column>
                            <el-table-column :label="item.propName" :property="item.prop" v-for="item in tablecolumn"
                                :key="item.prop" width="120px">
                                <template slot-scope="scope">
                                    <span> {{scope.row[scope.column.property]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="BeginDate" label="日期"></el-table-column>
                        </el-table>
                        <div style="text-align: center;margin-top: 30px;">
                            <el-pagination @size-change="handleSizeChange" @current-change="current_change"
                                v-if="pageshow" :page-sizes="[10, 20, 30, 50]" :page-size="pagesize"
                                layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </div>
                    </el-form>
                </el-card>
            </el-col>

        </el-row>
    </div>
</template>

<script>
    import { GetInfo, SearchInfo, DownLoad } from './../api/index.js'

    export default {
        name: "processsearch",
        data() {
            return {
                sn: "",
                fgsn: "",
                station: "",
                first: "",
                second: "",
                stationlist: "",

                pageshow: true,
                tabledata: [],
                tablecolumn: [],
                total: 0,
                pagesize: 10,
                currentPage: 1,
                loading: false,
                loading2: false,
                show: false,
                line: "",
                linelist: "",
            }
        },
        created() {
            this.Get_station();
            this.get_linelist();
        },
        watch: {
            stationlist() {
                this.station = this.stationlist[0].StationID;
            }
        },
        methods: {
            get_linelist() {
                var params = {
                    mode: "Get_Line"
                };
                GetInfo(params)
                    .then(res => {
                        this.linelist = res.data.rows;
                    })
                    .catch(error => { console.log(error) })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            current_change: function (currentPage) {
                this.currentPage = currentPage;
                console.log(this.currentPage);
            },
            //查詢所有工站
            Get_station() {
                this.loading2 = true;
                var params = {
                    mode: "Get_station"
                };
                GetInfo(params)
                    .then(res => {
                        this.loading2 = false;
                        console.log(res.data.Table);
                        this.stationlist = res.data.Table;
                    })
                    .catch(function (error) { console.log(error) })
            },

            //重置
            handle_refresh() {
                this.first = "";
                this.second = "";
                this.sn = "";
                this.fgsn = "";
                this.station = this.stationlist[0].StationID;
                this.total = 0;
                this.line = "";
                this.tabledata = [];
                this.currentPage = 1;
                this.current_change(1);
                this.pageshow = false;
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
            },
            //點擊查詢
            handle_search() {
                var params = {
                    mode: "Search_process",
                    sn: this.sn,
                    fgsn: this.fgsn,
                    station: this.station,
                    first: this.first,
                    second: this.second,
                    lineid: this.line
                };

                var params2 = {
                    mode: "get_processcomponent",
                    station: this.station
                };
                this.tablecolumn = [];

                if (this.sn == "" && this.fgsn == "" && (this.second == "" || this.first == "")) {
                    this.$message({ message: "请输入sn或选择日期", type: "error", closeShow: true });
                }
                else if (this.second != "" && this.first != "" && this.second < this.first) {
                    this.$message({ message: "結束日期不能小於起始日期", type: "warning", closeShow: true });
                }
                // if (this.second == "" || this.first == "") {
                //     this.$message({ message: "請選擇日期", type: "error", closeShow: true });
                // }
                // else if (this.second < this.first) {
                //     this.$message({ message: "結束日期不能小於起始日期", type: "warning", closeShow: true });
                // }
                else {
                    this.loading = true;
                    SearchInfo(params)
                        .then(res => {
                            this.loading = false;
                            this.currentPage = 1;
                            this.current_change(1);
                            this.pageshow = false;
                            this.$nextTick(() => {//重新渲染分页
                                this.pageshow = true;
                            });
                            this.tabledata = res.data.rows;
                            if (res.data.rows[0].注入前Buffer液量 != undefined) {
                                this.tablecolumn.push(
                                    { prop: "注入前矽油量", propName: "注入前矽油量" },
                                    { prop: "注入後矽油量", propName: "注入後矽油量" },
                                    { prop: "注入前Buffer液量", propName: "注入前Buffer液量" },
                                    { prop: "注入後Buffer液量", propName: "注入後Buffer液量" });
                            }
                            this.total = res.data.total;
                            console.log(res.data);
                        })
                        .catch(function (error) { console.log(error) })

                    SearchInfo(params2)
                        .then(res => {
                            console.log(this.station);
                            if (this.station == "ST00") {
                                this.tablecolumn.push({ prop: "WorkOrder", propName: "工单" },
                                    { prop: "Parameter1", propName: "料号" },
                                    { prop: "Parameter2", propName: "数量" });
                            }
                            if (this.station == "ST01") {
                                this.tablecolumn.push({ prop: "Mparameter5", propName: "工令" });
                            }
                            if (this.station == "Sub_ST01" || this.station == "Sub_ST02" || this.station == "Sub_ST03" || this.station == "Sub_ST04") {
                                this.tablecolumn.push(
                                    { prop: "Parameter1", propName: "工單料号" },
                                    { prop: "Parameter2", propName: "工單数量" });
                            }
                            if (this.station == "REPRINT") {
                                this.tablecolumn.push({ prop: "Parameter1", propName: "类型" });
                            }



                            for (var i = 0; i < res.data.total; i++) {
                                this.tablecolumn.push({ prop: res.data.rows[i].componentitem, propName: res.data.rows[i].ComponentName });
                            }

                            console.log(this.tablecolumn);
                        })
                        .catch(function (error) { console.log(error) })


                    var params3 = {
                        mode: "searchcolumn",
                        stationid: this.station,
                    };
                    SearchInfo(params3)
                        .then(res => {
                            console.log(res.data);
                            for (var i = 0; i < res.data.total; i++) {
                                this.tablecolumn.push({ prop: "MParameter" + res.data.rows[i].itemno, propName: res.data.rows[i].ParameterName });
                            }
                        })
                }
            },

            //點擊下載
            handle_download() {
                var params = {
                    mode: "down_process",
                    sn: this.sn,
                    fgsn: this.fgsn,
                    station: this.station,
                    first: this.first,
                    second: this.second,
                    lineid: this.line
                };
                if (this.sn == "" && this.fgsn == "" && (this.second == "" || this.first == "")) {
                    this.$message({ message: "请输入sn或选择日期", type: "error", closeShow: true });
                }
                else if (this.second != "" && this.first != "" && this.second < this.first) {
                    this.$message({ message: "結束日期不能小於起始日期", type: "warning", closeShow: true });
                }
                // if (this.second == "" || this.first == "") {
                //     this.$message({ message: "請選擇日期", type: "error", closeShow: true });
                // }
                // else if (this.second < this.first) {
                //     this.$message({ message: "結束日期不能小於起始日期", type: "warning", closeShow: true });
                // }
                else {
                    var date = new Date(); //实例化一个时间对象
                    var year = date.getFullYear(); //获取年
                    var month = date.getMonth() + 1; //获取月份，因为是0-11.所以要加上1
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    var strpath = year + "-" + month + "-" + day + "-" + " " + hour + ":" + minute + ":" + second;//excel文件名
                    // DownLoad(params)
                    //     .then(res => {
                    //         location.href = location.origin + "/" + res;
                    //     })
                    //     .catch(function (error) { console.log(error) })

                    let elink = document.createElement('a');
                    elink.href = "api/DownManage?mode=down_process&sn=" + this.sn + "&fgsn=" + this.fgsn + "&first=" + this.first + "&second=" + this.second + "&station=" + this.station + "&lineid=" + this.line;
                    elink.download = strpath + ".xls";
                    elink.click();

                }


            },
        }

    }
</script>