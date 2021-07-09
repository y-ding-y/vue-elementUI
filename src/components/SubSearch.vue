<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">

                <el-table :data="tabledata" class="table3" border>
                    <el-table-column prop="FactorySN" label="FactorySN" width="130px"></el-table-column>
                    <el-table-column prop="LineID" label="LineID" width="80px"></el-table-column>
                    <el-table-column prop="TestResult" label="TestResult" width="90px">
                    </el-table-column> 
                    <el-table-column label="Parameter3" width="130px">
                        <template slot-scope="{row}">
                            <el-link :underline="false" type="primary" @click="handle_param(row.Parameter3)">
                                {{row.Parameter3}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Parameter4" width="130px">
                        <template slot-scope="{row}">
                            <el-link :underline="false" type="primary" @click="handle_param(row.Parameter4)">
                                {{row.Parameter4}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Parameter5" width="130px">
                        <template slot-scope="{row}">
                            <el-link :underline="false" type="primary" @click="handle_param(row.Parameter5)">
                                {{row.Parameter5}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="BeginDate" label="日期"></el-table-column>
                </el-table>

            </el-col>
        </el-row>

        <el-dialog title="追溯2" :visible.sync="visible1">
            <el-table :data="tabledata2"   border>
                    <el-table-column prop="FactorySN" label="FactorySN" width="130px"></el-table-column> 
                    <el-table-column prop="LineID" label="LineID" width="80px"></el-table-column>
                    <el-table-column prop="TestResult" label="TestResult" width="90px">
                    </el-table-column>
                    <el-table-column prop="TestInformation" label="TestInformation" width="120px">
                    </el-table-column> 
                    <el-table-column label="Parameter3" width="130px">
                        <template slot-scope="{row}">
                            <el-link :underline="false" type="primary" @click="handle_param2(row.Parameter3)">
                                {{row.Parameter3}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Parameter4" width="130px">
                        <template slot-scope="{row}">
                            <el-link :underline="false" type="primary" @click="handle_param2(row.Parameter4)">
                                {{row.Parameter4}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Parameter5" width="130px">
                        <template slot-scope="{row}">
                            <el-link :underline="false" type="primary" @click="handle_param2(row.Parameter5)">
                                {{row.Parameter4}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Parameter6" width="130px">
                        <template slot-scope="{row}">
                            <el-link :underline="false" type="primary" @click="handle_param2(row.Parameter6)">
                                {{row.Parameter4}}</el-link>
                        </template>
                    </el-table-column> 
                    <el-table-column prop="BeginDate" label="日期"></el-table-column>
                </el-table>

        </el-dialog>
    </div>
</template>

<script>
    import { SearchInfo } from './../api/index.js' 
    export default {
        data() {
            return {
                tabledata: [],
                tabledata2: [],
                sn: "", 
                visible1:false
            }
        }, 
        created() {
            this.sn = this.$store.getters.getlot;
            console.log(this.$store.getters.getlot);
            this.Search_sub();
        },
        methods: {
            Search_sub() {
                this.$store.commit("setlot2", "");
                var params = {
                    mode: "Search_sub",
                    sn: this.sn
                };
                if (this.sn != "") {
                    SearchInfo(params)
                        .then(res => {
                            console.log(res.data)
                            this.tabledata = res.data.rows;
                        })
                        .catch(function (error) { console.log(error) })
                }
                else {
                    this.tabledata = [];

                }

            },

            handle_param(element) {
                var temp = element.substring(0, 1);
                var sub = element.substring(0, 3);
                console.log(element);
                if (temp == "L") {
                    this.$route.path.replace('/', '');
                    this.$router.push("/showiqc?sn=" + element);
                }
                if (sub == "WIB") {
                    this.visible1 = true;
                    this.$store.commit("setlot2", element)
                    this.key1++;
                }

            },

            handle_param2(element) {
                var temp = element.substring(0, 1);
                var sub = element.substring(0, 3);
                if (temp == "L") {
                    //this.$store.commit("setlot", element);
                    this.$route.path.replace('/', '');
                    this.$router.push("/showiqc?sn=" + element);
                    // this.$route.path.replace('/', '');
                    // this.$router.push("/iqc_search"); 
                }
                // if (sub == "WIB") {
                //     this.$store.commit("setlot", element)
                //     this.key1++;
                // }

            },

            Search_sub2() {
                var params = {
                    mode: "Search_sub",
                    sn: this.sn
                };
                if (this.sn != "") {
                    SearchInfo(params)
                        .then(res => { 
                            this.tabledata2 = res.data.rows;
                        })
                        .catch(function (error) { console.log(error) })
                }
                else{
                    this.tabledata=[];
                }

            },
        }
    }
</script>

<style>
    .el-divider__text {
        background-color: rgb(255, 255, 255);
    }

    .table3 th {
        background-color: rgb(163, 192, 255);
        color: #000;
    }

    .table3 tr {
        background-color: rgb(239, 247, 255);
        color: black;
    }
</style>