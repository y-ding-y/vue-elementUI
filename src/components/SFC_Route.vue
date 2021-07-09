<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <el-card>
                    <el-select v-model="pnname">
                        <el-option v-for="item in masterlist" :key="item.pnanme" :value="item.pnname"></el-option>
                    </el-select>

                    <el-table :data="tabledata" stripe border>
                        <el-table-column prop="masteritem" label="Master Item"></el-table-column>
                        <el-table-column prop="sectorid" label="Sector ID"></el-table-column>
                        <el-table-column prop="routeseq" label="Seq"></el-table-column>
                        <el-table-column prop="stationid" label="Station ID"></el-table-column>
                        <el-table-column prop="lineitem" label="Line Item"></el-table-column>
                        <el-table-column prop="componentitem" label="Component Item"></el-table-column>
                        <el-table-column prop="checksp" label="Check SP"></el-table-column>
                        <el-table-column prop="checkstationid" label=" Check StationID"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { GetInfo } from './../api/index.js'

    export default {
        data() {
            return {
                pnname: "",
                masterlist: "",

                tabledata: [],
            }
        },
        created() {
            this.Get_Master();
        },
        watch: {
            pnname() {
                this.Get_Route();
            }
        },
        methods: {
            //获取Master
            Get_Master() {
                var params = {
                    mode: "Get_Master"
                };
                GetInfo(params)
                    .then(res => {
                        var model = res.data.rows;
                        this.masterlist = model;
                    })
                    .catch(function (error) { console.log(error) })
            },

            //根据选择的master查询sfc_route
            Get_Route() {
                var params = {
                    mode: "Get_Route",
                    pnname: this.pnname
                };
                GetInfo(params)
                    .then(res => {
                        console.log(res.data)
                        var model = res.data.rows;
                        this.tabledata = model;
                    })
                    .catch(function (error) { console.log(error) })
            }

        }
    } 
</script>