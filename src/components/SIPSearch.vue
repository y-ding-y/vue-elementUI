<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <el-card>
                    <el-form inline width="80px">
                        <el-form-item label="SIP">
                            <el-select v-model="sip">
                                <el-option v-for="(item,index) in siplist" :value="item.SIPNO" :key="index">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Version">
                            <el-select v-model="version" v-loading="versionload">
                                <el-option v-for="(item,index) in versionlist" :value="item.Reversion" :key="index">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-button icon="el-icon-search" @click="handle_search" type="primary">Search</el-button>
                            <el-button icon="el-icon-refresh" @click="handle_refresh" type="primary">Reset</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="tabledata" v-loading="loading" border>
                        <el-table-column prop="SIPNO" label="SIPNO" width="100px"></el-table-column>
                        <el-table-column prop="Reversion" label="版本" width="80px"></el-table-column>
                        <el-table-column prop="ItemNo" label="序号" width="50px"></el-table-column>
                        <el-table-column prop="ItemName" label="项目" width="120px"></el-table-column>
                        <el-table-column prop="ItemDesc" label="规格"></el-table-column>
                        <el-table-column prop="Unit" label="单位" width="80px"></el-table-column>
                        <el-table-column prop="HighLimit" label="上限" width="100px"></el-table-column>
                        <el-table-column prop="LowLimit" label="下限" width="100px"></el-table-column>
                        <el-table-column prop="Standard" label="測試基準" width="100px"></el-table-column>
                        <el-table-column prop="Tool" label="检验工具"></el-table-column>
                        <el-table-column prop="CreateDate" label="日期"></el-table-column>
                        <el-table-column prop="CreateUser" label="创建人"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { GetInfo, SearchInfo } from './../api/index.js'
    export default {
        data() {
            return {
                tabledata: [],
                siplist: "",
                versionlist: "",
                sip: "",
                version: "",

                loading: false,
                versionload:false,
            }
        },
        created() {
            this.Get_sip();
          //  this.Get_version();
        },
        watch: {
            sip() {
                if (this.sip != "") {
                    this.Get_version();
                    this.version="";
                }
            },
            version() {
                if (this.sip == "") {
                    this.$message({ message: "请选择SIP", type: "warning", showClose: true });
                }
            },
        },
        methods: {
            Get_sip() {
                var params = {
                    mode: "Get_sip"
                }
                this.versionload=true;
                GetInfo(params)
                    .then(res => {
                        this.versionload=false;
                        this.siplist = res.data.rows
                    })
                    .catch(function (error) { console.log(error) })
            },

            Get_version() {
                var params = {
                    mode: "Get_version",
                    sip: this.sip
                }
                GetInfo(params)
                    .then(res => {
                        this.versionlist = res.data.rows
                    })
                    .catch(function (error) { console.log(error) })
            },

            handle_search() {
                var params = {
                    mode: "search_sip",
                    sip: this.sip,
                    version: this.version
                }

                if (this.sip == "") {
                    this.$message({ message: "请选择SIP", type: "error", showClose: true });
                }
                else if (this.version == "") {
                    this.$message({ message: "请选择Version", type: "error", showClose: true });
                }
                else {
                    this.loading = true;
                    SearchInfo(params)
                        .then(res => {
                            this.loading = false;
                            this.tabledata = res.data.rows
                        })
                        .catch(function (error) { console.log(error) })
                }

            },

            //重置
            handle_refresh() {
                this.sip = "";
                this.version = "";
                this.tabledata = [];
            }
        }
    }
</script>