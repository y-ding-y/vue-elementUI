<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <el-card>
                    <el-form label-width="80px" inline>
                        <el-form-item label="FactorySN">
                            <el-input v-model="sn"></el-input>
                        </el-form-item>
                        <el-form-item label="产线">
                            <el-select v-model="line">
                                <el-option v-for="item in linelist" :value="item.LineID" :label="item.LineDesc" :key="item.LineID"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="選擇日期">
                            <el-date-picker v-model="first" type="datetime" placeholder="起始時間"
                                value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>--
                            <el-date-picker v-model="second" type="datetime" placeholder="結束時間" default-time="23:59:59"
                                value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item lable="">
                            <el-button type="primary" icon="el-icon-search" @click="handle_search">Search</el-button>
                            <el-button type="primary" icon="el-icon-refresh" @click="handle_refresh">Reset</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :data="datatable.slice((currentpage-1)*pagesize,currentpage*pagesize)" border stripe
                        v-loading="loading1">
                        <el-table-column label="FactorySN" prop="sn" width="120px"></el-table-column>
                        <el-table-column label="工站" prop="stationid" width="50px"></el-table-column>
                        <el-table-column label="操作人" prop="workid"></el-table-column>
                        <el-table-column label="产线" prop="lineid" width="80px"></el-table-column>
                        <el-table-column label="测试结果" prop="result" width="80px"></el-table-column>
                        <el-table-column label="维修代码" prop="repaircode" width="80px"></el-table-column>
                        <el-table-column label="维修描述" prop="repairitem"></el-table-column>
                        <el-table-column label="测试项目" prop="erroritem"></el-table-column>
                        <el-table-column label="不良描述" prop="errorcode"></el-table-column>
                        <el-table-column label="开始时间" prop="begindate"></el-table-column>
                        <el-table-column label="结束时间" prop="enddate"></el-table-column>
                    </el-table>

                    <div style="text-align: center;margin-top:30px;">
                        <el-pagination @size-change="handlesizechange" @current-change="current_change"
                            :page-sizes="[10,20,30,50]" :page-size="pagesize"
                            layout="total,sizes,prev,pager,next,jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>


    </div>
</template>

<script>
    import { GetInfo, SearchInfo } from '@/api/index.js'

    export default {
        data() {
            return {
                datatable: [],
                sn: "",
                first: "",
                second: "",
                loading1: false,
                pagesize: 10,
                total: 0,
                currentpage: 1,
                linelist: "",
                line: "",
            }
        },
        created(){
            this.get_line();
        },
        methods: {
            get_line() {
                var params = {
                    mode: "Get_Line"
                };
                GetInfo(params)
                    .then(res => {
                        this.linelist = res.data.rows;
                    })
                    .catch(error => { console.log(error) })
            },
            handle_search() {
                var params = {
                    mode: "Search_error",
                    sn: this.sn,
                    first: this.first,
                    second: this.second,
                    lineid:this.line
                }
                // if (this.sn == "" || this.first == "") {
                //     this.$message({ message: "请输入SN", type: "error" })
                // }
                // else if ( this.first == "" || this.second == "") {
                //     this.$message({ message: "请选择日期", type: "error" })
                // }
                if (this.first > this.second) {
                    this.$message({ message: "起始日期不能大于结束日期", type: "error" })
                }
                else {
                    this.loading1 = true;
                    SearchInfo(params)
                        .then(res => {
                            this.loading1 = false;
                            this.datatable = res.data.rows;
                            this.total = res.data.total;
                        })
                        .catch(function (error) { console.log(error) })
                }
            },
            handlesizechange(val) {
                this.pagesize = val;
            },

            //翻页
            current_change(val) {
                this.currentpage = val;
            },

            //表格序号  
            getIndex($index) {
                return ((this.currentpage - 1) * this.pagesize + $index + 1)
            },
            handle_refresh() {
                this.sn = "";
                this.first = "";
                this.second = "";
                this.datatable = [];
                this.line="";
            }
        }
    }
</script>