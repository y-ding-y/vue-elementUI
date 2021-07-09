<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <el-form inline label-width="80" @submit.native.prevent>
                    <el-form-item label="选择查询类型">
                        <el-radio-group v-model="chosetype">
                            <el-radio label="sn">FactorySN</el-radio>
                            <el-radio label="fgsn">FGSN</el-radio>
                            <el-radio label="component">零件+批号</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="" v-loading="selectloading">
                        <div v-bind:style="{display:chosedisplay}">
                            <el-input placeholder="批号" v-model="lot" class="input-with-select">
                                <el-select v-model="component" slot="prepend" placeholder="请选择" style="width: 150px;"
                                    filterable>
                                    <el-option v-for="item in componentlist" :value="item.componentitem"
                                        :label="item.componentitem" :key="item.componentitem">{{item.componentitem}}
                                    </el-option>
                                </el-select>
                            </el-input>
                        </div>

                        <el-input v-bind:style="{display:chosedisplay2}" v-model="temp"
                            @keyup.enter.native="chosehandle"></el-input>
                    </el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="chosehandle">Search</el-button>
                    <el-button type="primary" icon="el-icon-refresh" @click="handle_refresh">Rest</el-button>
                </el-form>
                <el-card v-bind:style="{display:dis1}">

                    <el-table ref="classTable" class="table1" :data="tabledata" border @expand-change="handle_expand"
                        row-key="id" v-loading="loading1">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table border :data="props.row.dicts" class="table2" :key="props.row.id"
                                    v-loading="loading2">
                                    <el-table-column prop="FactorySN" label="FactorySN" width="130px">
                                    </el-table-column>
                                    <el-table-column prop="LineID" label="LineID" width="80px">
                                    </el-table-column>
                                    <el-table-column prop="TestResult" label="TestResult" width="90px">
                                    </el-table-column>
                                    <!-- <el-table-column prop="TestInformation" label="TestInformation" width="120px">
                                    </el-table-column> -->
                                    <!-- <el-table-column label="Parameter1" width="130px">
                                        <template slot-scope="{row}">
                                            <a class="el-link" @click="handle_param(row.Parameter1)">
                                                {{row.Parameter1}} </a>
                                        </template>
                                    </el-table-column> -->
                                    <el-table-column prop="BeginDate" label="日期"></el-table-column>
                                    <el-table-column :label="item.propName" :property="item.prop"
                                        v-for="item in tableColumnList" :key="item.prop" align="center">
                                        <template slot-scope="scope">

                                            <el-link type="primary" :underline="false"
                                                v-if="props.row.stationid!='ST00'"
                                                @click="handle_param(scope.row[scope.column.property])">
                                                {{scope.row[scope.column.property]}}</el-link>

                                            <span v-if="props.row.stationid=='ST00'">
                                                {{scope.row[scope.column.property]}} </span>
                                        </template>
                                    </el-table-column>

                                    <!-- <el-table-column v-for="(item,key,index) in tablecolumn" :label="item.componentitem"
                                        :key="index">
                                        <template slot-scope="scope">

                                            <span>{{ getDataName(scope.row,item) }}</span>
                                        </template>
                                    </el-table-column> -->
                                </el-table>

                                <!-- <el-table  :data="props.row.dicts" >
                                   
                                </el-table> -->


                            </template>
                        </el-table-column>
                        <el-table-column label="MaterItem" prop="masteritem"></el-table-column>
                        <el-table-column label="Sector" prop="sectorid"></el-table-column>
                        <el-table-column label="Station ID" prop="stationid"></el-table-column>
                    </el-table>
                </el-card>

                <el-card v-bind:style="{display:dis2}">
                    <tracecomponent :key="key2"></tracecomponent>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog :visible.sync="visible1" title="追溯1">
            <el-table :data="tabledata2" class="table3" border v-loading="loading3">
                <el-table-column prop="FactorySN" label="FactorySN" width="130px"></el-table-column>
                <el-table-column prop="LineID" label="LineID" width="80px"></el-table-column>
                <el-table-column prop="TestResult" label="TestResult" width="90px">
                </el-table-column>

                <el-table-column :label="item.propName" :property="item.prop" v-for="item in tablecolumn1"
                    :key="item.prop" align="center">
                    <template slot-scope="scope">
                        <el-link type="primary" :underline="false"
                            @click="handle_param2(scope.row[scope.column.property])">
                            {{scope.row[scope.column.property]}}</el-link>
                    </template>
                </el-table-column>

                <el-table-column prop="BeginDate" label="日期"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog :visible.sync="visible2" title="追溯2" style="width: 100%;">
            <el-table :data="tabledata3" border v-loading="loading4">
                <el-table-column prop="FactorySN" label="FactorySN" width="130px"></el-table-column>
                <el-table-column prop="LineID" label="LineID" width="80px"></el-table-column>
                <el-table-column prop="TestResult" label="TestResult" width="90px">
                </el-table-column>
                <el-table-column prop="TestInformation" label="TestInformation" width="120px">
                </el-table-column>
                <el-table-column :label="item.propName" :property="item.prop" v-for="item in tablecolumn2"
                    :key="item.prop" align="center">
                    <template slot-scope="scope">
                        <el-link type="primary" :underline="false"
                            @click="handle_param3(scope.row[scope.column.property])">
                            {{scope.row[scope.column.property]}}</el-link>
                    </template>
                </el-table-column>

                <el-table-column prop="BeginDate" label="日期"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import { SearchInfo, GetInfo } from './../api/index.js'
    import tracecomponent from './Tracecomponent.vue'

    export default {
        name: "tracesearch",
        data() {
            return {
                tabledata: [],
                tablecolumn: [],
                tabledata2: [],
                tabledata3: [],
                sn: "",
                item: "",
                component: "",
                lot: "",
                key1: 1,
                key2: 1,
                activeNames: ['1', '2'],
                chosetype: "sn",
                temp: "",
                chosedisplay: "none",
                chosedisplay2: "block",
                componentlist: "",
                dis1: "block",
                dis2: "none",
                visible1: false,
                visible2: false,
                tableColumnList: [],
                tablecolumn1: [],
                tablecolumn2: [],


                templist: [],

                loading1: false,
                loading2: false,
                loading3: false,
                loading4: false,
                selectloading: false,


            }
        },
        components: {
            tracecomponent
        },
        // created() {
        //     this.definetable();
        // },
        watch: {
            chosetype() {
                this.handle_refresh();
                this.temp = "";
                if (this.chosetype == "component") {
                    this.Get_component();
                    this.component = "";
                    this.chosedisplay = "block";
                    this.chosedisplay2 = "none";
                    this.dis2 = "block";
                    this.dis1 = "none";

                }
                else {
                    this.chosedisplay = "none";
                    this.chosedisplay2 = "block";
                    this.dis2 = "none";
                    this.dis1 = "block";
                }
            }
        },
        methods: {
            definetable() {
                this.tableColumnList = [{ prop: 'FactorySN', propName: 'SN' },
                { prop: 'StationID', propName: '工站' },
                { prop: 'LineID', propName: 'Line ID' },
                { prop: 'BeginDate', propName: '日期' },
                { prop: 'TestResult', propName: '测试结果' },];
            },
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handle_refresh() {
                this.sn = "";
                this.tabledata = [];
                this.item = "";
                this.$store.commit("setlot", "");
                this.$store.commit("settracelot", "");
                this.$store.commit("settracecomponent", "");
                this.key1++;
                this.key2++;
                this.temp = "";
                this.component = "";
                this.lot = "";
            },
            handle_searchsn() {
                var params = {
                    mode: "Get_route",
                    sn: this.sn
                }
                this.loading1 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        for (var i = 0; i < res.data.total; i++) {
                            res.data.rows[i].id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                            res.data.rows[i].dicts = [];
                        }
                        this.tabledata = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })
            },

            //展開子表
            handle_expand(row, expandedRows) {
                this.tableColumnList = [];
                row.dicts.length = 0
                //  this.definetable();
                this.$store.commit("setlot", "");
                this.key1++;
                if (expandedRows.length > 0) {
                    const $classTable = this.$refs.classTable
                    if (expandedRows.length > 1) {
                        expandedRows.forEach(expandRow => {
                            if (row.id !== expandRow.id) {
                                $classTable.toggleRowExpansion(expandRow, false)
                                row.dicts.length = 0
                                this.tableColumnList = [];
                            }
                        })
                    }

                    if (this.tableColumnList == 0) { 
                        this.get_compopnrnt(row);
                        this.handle_searchexpand(row, expandedRows);
                    }

                }
                else {
                    row.dicts.length = 0
                    this.tableColumnList = [];
                }

            },

            handle_searchexpand(row, expandedRows) {
                if (row.dicts.length == 0) { //这里做了一个判断，首先判断这一行的数据对象有没有dicts这个属性，如果没说明没有数据我们需要请求后台，相当于懒加载 
                    var params = {
                        mode: "Search_St",
                        sn: this.sn,
                        station: row.stationid,
                        masteritem: row.masteritem,
                        routeseq: row.routeseq
                    };

                    this.loading2 = true;
                    let self = this
                    SearchInfo(params)
                        .then(rspData => { //这里是我们项目里封装的ajax请求方法，相当于axios.post() 
                            this.loading2 = false;
                            const index = self.tabledata.findIndex(data => data.id === row.id) //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
                            if (rspData.data && rspData.data.length) {
                                rspData.data.forEach(item => { //这里我是给每个子分组信息里都加上父分组的id，以方便后面操作子表格每一行后，回调函数里刷新数据时需要用到，要知道他的父亲是谁，哈哈
                                    item.labelId = row.id
                                })
                            }
                            self.$set(self.tabledata[index], 'dicts', rspData.data.rows) //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里

                        }) //关键就是这个方法，row.id是父分组的id需要传给后台查询该子分组的信息 
                }
            },

            //點擊el-link跳轉
            handle_param(element) {
                var temp = element.substring(0, 1);
                var sub = element.substring(0, 3);
                if (temp == "L") {
                    //this.$store.commit("setlot", element);
                    this.$route.path.replace('/', '');
                    this.$router.push("/showiqc?sn=" + element);
                    this.visible1 = false;
                    this.visible2 = false;
                    // this.$route.path.replace('/', '');
                    // this.$router.push("/iqc_search"); 
                }
                if (sub == "WIB") {
                    this.visible1 = true;
                    this.tablecolumn1 = [];
                    var params = {
                        mode: "Search_sub",
                        sn: element
                    };
                    this.loading3 = true;
                    SearchInfo(params)
                        .then(res => {
                            this.loading3 = false
                            this.tabledata2 = res.data.rows;
                        })
                        .catch(function (error) { console.log(error) })

                    var params2 = {
                        mode: "Get_subcomponent",
                        sn: element
                    };
                    SearchInfo(params2)
                        .then(res => {
                            this.tablecolumn = res.data.rows;
                            for (var i = 0; i < res.data.total; i++) {
                                this.tablecolumn1.push({ prop: res.data.rows[i].componentitem, propName: res.data.rows[i].ComponentName });
                            }
                        })
                        .catch(function (error) { console.log(error) })
                }

            },

            //成品追溯厂内
            handle_searchsn_item() {
                var params = {
                    mode: "Get_route_item",
                    item: this.item
                }
                this.loading1 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        for (var i = 0; i < res.data.total; i++) {
                            res.data.rows[i].id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                            res.data.rows[i].dicts = [];
                        }
                        this.tabledata = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })

                var params2 = {
                    mode: "Get_sn",
                    item: this.item
                }
                SearchInfo(params2)
                    .then(res => {
                        this.sn = res.data;
                    })
                    .catch(function (error) { console.log(error) })
            },

            //选择查询类型
            chosehandle() {
                this.sn = "";
                this.tabledata = [];
                this.item = "";
                this.$store.commit("setlot", "");
                this.key1++;
                if (this.chosetype == "sn") {
                    this.sn = this.temp;
                    this.handle_searchsn();
                }
                if (this.chosetype == "fgsn") {
                    this.item = this.temp;
                    this.handle_searchsn_item();
                }
                if (this.chosetype == "component") {
                    this.handle_component();
                }
            },

            //零件+批号查询
            handle_component() {
                var params = {
                    mode: "search_component",
                    lot: this.lot,
                    component: this.component
                };
                this.$store.commit("settracelot", this.lot);
                this.$store.commit("settracecomponent", this.component);
                this.key2++;
                // SearchInfo(params)
                //     .then(res => {
                //         console.log(res.data.rows);
                //     })
                //     .catch(function (error) { console.log(error) });
            },

            //获取子表的表名
            get_compopnrnt(row) {
                this.tableColumnList = [];
                console.log(row.stationid);
                console.log(this.tableColumnList);
                var params = {
                    mode: "Get_component",
                    masteritem: row.masteritem,
                    routeseq: row.routeseq
                };
                SearchInfo(params)
                    .then(res => {
                        var arr = [];
                this.tableColumnList = [];
                        this.tablecolumn = res.data.rows;
                        if (row.stationid == "ST00") {
                            // this.tableColumnList.push({ prop: "Parameter1", propName: "料号" },
                            //     { prop: "Parameter2", propName: "数量" });
                            // arr.push({ prop: "Parameter1", propName: "料号" },
                            //     { prop: "Parameter2", propName: "数量" });
                            this.$set(this.tableColumnList, 0, { prop: "Parameter1", propName: "料号" })
                            this.$set(this.tableColumnList, 1,  { prop: "Parameter2", propName: "数量" })
                        }
                        console.log(res.data.total);
                        for (var i = 0; i < res.data.total; i++) {
                            //   this.tableColumnList.push({ prop: res.data.rows[i].componentitem, propName: res.data.rows[i].ComponentName });
                            //   arr.push({ prop: res.data.rows[i].componentitem, propName: res.data.rows[i].ComponentName });

                            this.$set(this.tableColumnList, i, { prop: res.data.rows[i].componentitem, propName: res.data.rows[i].ComponentName })
                        }

                        // this.$nextTick(function () {
                        //     this.tableColumnList = arr
                        // })
                    })
                    .catch(function (error) { console.log(error) })
            },

            //查询所有零件
            Get_component() {
                var params = {
                    mode: "Get_component"
                }
                this.selectloading = true;
                GetInfo(params)
                    .then(res => {
                        this.selectloading = false;
                        this.componentlist = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })
            },

            handle_param2(element) {
                var temp = element.substring(0, 1);
                var sub = element.substring(0, 3);
                if (temp == "L") {
                    this.$route.path.replace('/', '');
                    this.$router.push("/showiqc?sn=" + element);
                    this.visible1 = false;
                    this.visible2 = false;
                }
                if (sub == "WIB") {
                    this.visible2 = true;
                    this.tablecolumn2 = [];
                    var params = {
                        mode: "Search_sub",
                        sn: element
                    };
                    this.loading4 = true;
                    SearchInfo(params)
                        .then(res => {
                            this.loading4 = false;
                            this.tabledata3 = res.data.rows;
                        })
                        .catch(function (error) { console.log(error) })

                    var params2 = {
                        mode: "Get_subcomponent",
                        sn: element
                    };
                    SearchInfo(params2)
                        .then(res => {
                            this.tablecolumn = res.data.rows;
                            for (var i = 0; i < res.data.total; i++) {
                                this.tablecolumn2.push({ prop: res.data.rows[i].componentitem, propName: res.data.rows[i].ComponentName });
                            }
                        })
                        .catch(function (error) { console.log(error) })
                }

            },

            handle_param3(element) {
                var temp = element.substring(0, 1);
                var sub = element.substring(0, 3);
                if (temp == "L") {
                    //this.$store.commit("setlot", element);
                    this.$route.path.replace('/', '');
                    this.$router.push("/showiqc?sn=" + element);
                    this.visible1 = false;
                    this.visible2 = false;
                    // this.$route.path.replace('/', '');
                    // this.$router.push("/iqc_search"); 
                }
                // if (sub == "WIB") {
                //     this.$store.commit("setlot", element)
                //     this.key1++;
                // }

            },

            getDataName(scope, items) {
                return scope[items]
            }
        },

    }
</script>

<style>
    .table1 th {
        background-color: rgb(114, 183, 248);
        color: white;
    }

    .table1 tr {
        background-color: rgb(235, 246, 255);
        color: black;
    }

    .table2 th {
        background-color: rgb(168, 168, 168);
        color: white;
    }

    .table2 tr {
        background-color: rgb(255, 255, 255);
        color: black;
    }

    .el-divider__text {
        background-color: rgb(255, 255, 255);
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>