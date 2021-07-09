<template>
    <div>

        <el-row :gutter="24">
            <el-col :span="24">
                <el-card>
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
                                    <el-select v-model="component" slot="prepend" placeholder="请选择"
                                        style="width: 150px;" filterable>
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
                        <el-button type="primary" icon="el-icon-search" @click="handle_searchiqc">Search IQC</el-button>
                        <el-button type="primary" icon="el-icon-refresh" @click="handle_refresh">Reset</el-button>
                        <el-button icon="el-icon-download" @click="saveImage" type="success">Down png</el-button>
                    </el-form>
                    <div v-bind:style="{display:dis1}">
                        <div ref="cardCanvas" style="width: 100%;height: 100%;">
                            <el-table border :data="tabletrace" :span-method="objectSpanMethod" class="tabletrace"
                                v-loading="loading1">
                                <el-table-column prop="lineid" label="產線"  ></el-table-column>
                                <el-table-column label="类型"  >FATP</el-table-column>
                                <el-table-column prop="stationname" label="工站"></el-table-column>
                                <el-table-column prop="parameter" label="制程参数名称"></el-table-column>
                                <el-table-column prop="val" label="制程参数"></el-table-column>
                                <el-table-column label="IPQC" align="center">
                                    <el-table-column prop="ipqc_parameter" label="检验项目"></el-table-column>
                                    <el-table-column prop="ipqc_val1" label="平均值"></el-table-column>
                                    <el-table-column prop="ipqc_val2" label="标准差"></el-table-column>
                                </el-table-column>
                                <el-table-column prop="createdate" label="過站時間"  ></el-table-column>
                                <el-table-column prop="workid" label="操作員"></el-table-column>
                            </el-table>
                        </div>

                    </div>

                    <div v-bind:style="{display:dis2}">
                        <tracecomponent :key="key2"></tracecomponent>
                    </div>
                </el-card>
            </el-col>
        </el-row>


        <el-dialog :visible.sync="visible2" title="IQC 查詢" style="width: 100%;">
            <el-table border :data="tableiqc" class="tabletrace2" v-loading="loading1">
                <el-table-column label="类型">IQC</el-table-column>
                <el-table-column prop="name" label="物料"></el-table-column>
                <!-- <el-table-column prop="nameid" label="nameid"></el-table-column> -->
                <el-table-column prop="lot" label="Lot">
                    <template slot-scope="{row}">
                        <el-link type="primary" :underline="false" @click="handle_param(row.lot)">
                            {{row.lot}}</el-link>

                    </template>
                </el-table-column>
                <el-table-column prop="begindate" label="進料日期"></el-table-column>
                <el-table-column prop="enddate" label="檢驗日期"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import html2canvas from 'html2canvas'
    import { SearchInfo, GetInfo } from './../api/index.js'
    import tracecomponent from './Tracecomponent.vue'

    export default {
        name: "trace",
        data() {
            return {
                tabledata: [],
                tabletrace: [],
                tablecolumn: [],
                tabledata2: [],
                tabledata3: [],
                tableiqc: [],
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
                spanArr: [],

                templist: [],

                loading1: false,
                loading2: false,
                loading3: false,
                loading4: false,
                selectloading: false,
                pos: 0,

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
            handle_refresh() {
                this.sn = "";
                this.tabletrace = [];
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
                            res.data.rows[i].colname = [];
                        }
                        this.tabledata = res.data.rows;
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
                var params = {
                    mode: "Trace_Search",
                    type: this.chosetype,
                    sn: this.temp
                }
                if (this.chosetype == "component") {
                    this.handle_component();
                }
                else {
                    this.handle_search(params);
                    //this.handle_searchiqc();
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

            //查詢用到的物料
            handle_searchiqc() {
                var params = {
                    mode: "Trace_IQC",
                    type: this.chosetype,
                    sn: this.temp
                }
                this.loading2 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading2 = false;
                        this.visible2 = true;
                        console.log(res.data);
                        this.tableiqc = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })
            },


            handle_search(params) {
                this.loading1 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        console.log(res.data);
                        this.pos = 0;
                        this.spanArr = [];
                        this.getSpanArr(res.data.rows);
                        this.tabletrace = res.data.rows;
                        // setTimeout(() => {

                        // }, 1000)
                    })
                    .catch(function (error) { console.log(error) })
            },
            getSpanArr(data) {
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i].stationname === data[i - 1].stationname) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }
                    }
                }
            },

            handle_param(element) {
                // var temp = element.substring(0, 1);
                // var sub = element.substring(0, 3); 
                //this.$store.commit("setlot", element);
                this.$route.path.replace('/', '');
                this.$router.push("/showiqc?sn=" + element);
                this.visible1 = false;
                this.visible2 = false;

            },

            saveImage(divText, imgText) {
                let canvasID = this.$refs.cardCanvas
                html2canvas(canvasID)
                    .then(canvas => {
                        let dataURL = canvas.toDataURL('image/png')
                        this.dataURL = dataURL
                        this.saveFile(dataURL, this.today + this.shiftday_txt + "生产总结")
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
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 1) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
                if (columnIndex === 2) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
                if (columnIndex === 0) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
                if (columnIndex === 8) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
                if (columnIndex === 9) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            }
        }
    }
</script>

<style>
    .tabletrace td {
        border: 1px solid rgb(77, 77, 77);
    }

    .tabletrace tr {
        pointer-events: none;
    }

    .tabletrace thead th {
        border: 1px solid rgb(77, 77, 77);
    }


    .tabletrace {
        border: 1px solid rgb(77, 77, 77);
    }

    .tabletrace thead.is-group th {
        background-color: rgb(97, 179, 255);
        color: white;
    }


    .tabletrace2 td {
        border: 1px solid;
    }

    .tabletrace2 thead th {
        border: 1px solid rgb(77, 77, 77);
    }


    .tabletrace2 {
        border: 1px solid;
    }

    .tabletrace2 thead.is-group th {
        background-color: rgb(97, 179, 255);
        color: white;
    }
</style>