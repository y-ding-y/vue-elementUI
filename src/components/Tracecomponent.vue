<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <!-- <el-table :data="tabledata" v-loading="loading" border @expand-change="handle_expand" row-key="id"
                    ref="classTable">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table border :data="props.row.dicts" :key="props.row.id">
                                <el-table-column label="SN">
                                    <template slot-scope="{row}">
                                        <span v-if="row.sn.substring(0,3)=='WIB'">
                                            <el-link @click="handle_param(row.sn)" type="primary" :underline="false">
                                                {{row.sn}}
                                            </el-link>
                                        </span>
                                        <span v-if="row.sn.substring(0,1)=='T'">
                                            <el-link @click="handle_getfgsn(row.sn)" type="success" :underline="false">
                                                {{row.sn}}
                                            </el-link>
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="component" label="component"></el-table-column>
                                <el-table-column prop="lot" label="批号"></el-table-column>
                                <el-table-column prop="createdate" label="日期"></el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>

                    <el-table-column label="SN">
                        <template slot-scope="{row}">
                            <span v-if="row.sn.substring(0,3)=='WIB'">
                                <el-link @click="handle_param(row.sn)" type="primary" :underline="false">
                                    {{row.sn}}
                                </el-link>
                            </span>
                            <span v-if="row.sn.substring(0,1)=='T'">
                                <el-link @click="handle_getfgsn(row.sn)" type="success" :underline="false">
                                    {{row.sn}}
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="component" label="component"></el-table-column>
                    <el-table-column prop="lot" label="批号"></el-table-column>
                    <el-table-column prop="createdate" label="日期"></el-table-column>
                </el-table> -->

                <el-table :data="tabledata" v-loading="loading" border>
                    <el-table-column label="SN">
                        <template slot-scope="{row}">
                            <span>
                                <el-link @click="handle_trace(row.sn)" type="primary" :underline="false">
                                    {{row.sn}}
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="component" :label="this.componentname"></el-table-column>
                    <el-table-column prop="lot" label="批号"></el-table-column>
                    <el-table-column prop="createdate" label="日期"></el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <el-dialog title="出货对应SN" :visible.sync="visible">
            <el-table :data="tablefgsn" border>
                <el-table-column label="SN" prop="FactorySN"></el-table-column>
                <el-table-column label="出货SN" prop="Parameter4"></el-table-column>
                <el-table-column label="日期" prop="BeginDate"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="追溯" :visible.sync="tracevisible">
            <el-table :data="tabletrace" v-loading="loading1" border>
                <el-table-column label="SN">
                    <template slot-scope="{row}">
                        <span>
                            <el-link @click="handle_trace2(row.sn)" type="primary" :underline="false">
                                {{row.sn}}
                            </el-link>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="component" :label="componentname1"></el-table-column>
                <el-table-column prop="lot" label="批号"></el-table-column>
                <el-table-column prop="createdate" label="日期"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="追溯2" :visible.sync="tracevisible2">
            <el-table :data="tabletrace2" v-loading="loading2" border>
                <el-table-column label="SN">
                    <template slot-scope="{row}">
                        <span>
                            <el-link @click="handle_trace3(row.sn)" type="primary" :underline="false">
                                {{row.sn}}
                            </el-link>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="component" :label="componentname2"></el-table-column>
                <el-table-column prop="lot" label="批号"></el-table-column>
                <el-table-column prop="createdate" label="日期"></el-table-column>
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
                tablefgsn: [],
                tabletrace: [],
                tabletrace2: [],
                lot: "",
                component: "",
                componentname: "物料名称",
                componentname1: "物料名称",
                componentname2: "物料名称",
                visible: false,
                loading: false,
                loading1: false,
                loading2: false,
                tracevisible: false,
                tracevisible2: false
            }
        },
        created() {
            this.lot = this.$store.getters.gettracelot;
            this.component = this.$store.getters.gettracecomponent;
            this.Search_trace();
        },
        watch: {
            component() {

            }
        },
        methods: {
            Search_trace() {
                var params = {
                    mode: "search_component",
                    lot: this.lot,
                    component: this.component
                };
                if (this.lot != "" && this.component != "") {
                    
               this.handle_searchcomponent();
                    console.log(params);
                    this.loading = true;
                    SearchInfo(params)
                        .then(res => {
                            this.loading = false;
                            console.log(res.data.rows);
                            for (var i = 0; i < res.data.total; i++) {
                                res.data.rows[i].dicts = [];
                            }

                            this.tabledata = res.data.rows;
                        })
                        .catch(function (error) { console.log(error) });
                }

            },

            handle_searchcomponent() {
                var params = {
                    mode: "Get_componentname",
                    component: this.component
                }
                SearchInfo(params)
                    .then(res => {
                        this.componentname = res.data.rows[0].componentname;
                    })
                    .catch(function (error) { console.log(error) })
            },
            //二次查询
            handle_param(element) {
                console.log(element)
                var params = {
                    mode: "search_trace2",
                    sn: element
                }
                this.loading1 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        console.log(res.data.rows)
                        this.tabletrace = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })

                var params2 = {
                    mode: "Get_componentname",
                    component: element
                }
                SearchInfo(params2)
                    .then(res => {
                        console.log(res.data);
                        this.componentname1 = res.data.rows[0].componentname;
                    })
                    .catch(function (error) { console.log(error) })

            },

            //二次查询
            handle_param2(element) {
                console.log(element)
                var params = {
                    mode: "search_trace2",
                    sn: element
                }
                this.loading2 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading2 = false;
                        console.log(res.data.rows)
                        this.tabletrace2 = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })

                var params2 = {
                    mode: "Get_componentname",
                    component: element
                }
                SearchInfo(params2)
                    .then(res => {
                        this.componentname2 = res.data.rows[0].componentname;
                    })
                    .catch(function (error) { console.log(error) })
            },

            //获取对应的出货号
            handle_getfgsn(element) {
                var params = {
                    mode: "get_fgsn",
                    sn: element
                }
                // this.visible = true;
                SearchInfo(params)
                    .then(res => {
                        console.log(res.data);
                        this.tablefgsn = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })
            },

            //展開子表
            handle_expand(row, expandedRows) {
                if (expandedRows.length > 0) {
                    const $classTable = this.$refs.classTable
                    if (expandedRows.length > 1) {
                        expandedRows.forEach(expandRow => {
                            if (row.id !== expandRow.id) {
                                $classTable.toggleRowExpansion(expandRow, false)
                            }
                        })
                    }
                    if (row.dicts.length == 0) { //这里做了一个判断，首先判断这一行的数据对象有没有dicts这个属性，如果没说明没有数据我们需要请求后台，相当于懒加载
                        var params = {
                            mode: "search_trace2",
                            sn: row.sn,
                        };
                        let self = this
                        SearchInfo(params)
                            .then(rspData => { //这里是我们项目里封装的ajax请求方法，相当于axios.post() 
                                for (var i = 0; i < rspData.data.total; i++) {
                                    rspData.data.rows[i].dicts = [];
                                }
                                const index = self.tabledata.findIndex(data => data.id === row.id) //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
                                if (rspData.data && rspData.data.length) {
                                    rspData.data.forEach(item => { //这里我是给每个子分组信息里都加上父分组的id，以方便后面操作子表格每一行后，回调函数里刷新数据时需要用到，要知道他的父亲是谁，哈哈
                                        item.labelId = row.id
                                    })
                                }
                                console.log(rspData.data);
                                self.$set(self.tabledata[index], 'dicts', rspData.data.rows) //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
                            }) //关键就是这个方法，row.id是父分组的id需要传给后台查询该子分组的信息

                    }
                }
            },

            handle_trace(element) {
                if (element.substring(0, 3) == "WIB") {
                    this.tracevisible = true;
                    this.handle_param(element);
                }
                if (element.substring(0, 1) == "T") {
                    this.visible = true
                    this.handle_getfgsn(element);
                }
            },

            handle_trace2(element) {
                if (element.substring(0, 3) == "WIB") {
                    this.tracevisible2 = true;
                    this.handle_param2(element);
                }
                if (element.substring(0, 1) == "T") {
                    this.visible = true
                    this.handle_getfgsn(element);
                }
            },

            handle_trace3(element) {
                if (element.substring(0, 3) == "WIB") {
                    // this.tracevisible2=true;
                    // this.handle_param(element);
                }
                if (element.substring(0, 1) == "T") {
                    this.visible = true
                    this.handle_getfgsn(element);
                }
            }
        }
    }
</script>