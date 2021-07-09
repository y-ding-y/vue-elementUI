<template>
    <div>
        <div v-bind:style="{display:selectdisplay}">
            <el-form inline label-width="100px">
                <el-form-item label="SIP">
                    <el-select v-model="sipno">
                        <el-option v-for="item in siplist" :value="item.sipno" :key="item.sipno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="SIP Version">
                    <el-select v-model="version">
                        <el-option v-for="item in verlist" :value="item.version" :key="item.version"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" @click="search_sip" type="success">Search</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table :data="tabledata.slice((currentpage-1)*pagesize,currentpage*pagesize)" border stripe
            :span-method="objectSpanMethod" :cell-class-name="handle_cellstyle" class="tabletrace2"
            v-loading="loading1">
            <template v-for="item in tablename">
                <el-table-column :prop="item.label" :label="item.label" :width="item.width" fixed align="center">
                </el-table-column>
            </template>
            <el-table-column label="檢驗項目" align="center">
                <template v-for="item in tablename2">
                    <el-table-column :label="item.label">
                        <el-table-column :label="item.cou_name" :prop="item.label">
                        </el-table-column>
                    </el-table-column>
                </template>
            </el-table-column>

        </el-table>

        <div style="text-align: center;margin-top:30px;">
            <el-pagination @size-change="handlesizechange" @current-change="current_change" :page-sizes="[10,20,30,50]"
                :page-size="pagesize" layout="total,sizes,prev,pager,next,jumper" :total="total" v-if="pageshow">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import bus from './bus.js'
    import { SearchInfo } from '@/api/index.js'

    export default {
        data() {
            return {
                pageshow: false,
                component: "",
                first: "",
                second: "",
                params: {},
                tabledata: [],

                siplist: "",
                verlist: "",
                sipno: "",
                version: "",

                selectdisplay: "none",
                tablename: [],
                tablename2: [],
                desc: {},

                pagesize: 10,
                total: 0,
                currentpage: 1,
                loading1: false,
            }
        },
        created() {
            this.params = this.$store.getters.getsip
            this.selectdisplay = "none";
            this.get_sip();
        },
        watch: {
            sipno() {
                this.verlist = "";
                this.version = "";
                this.params.mode = "search_verlist";
                this.params.sipno = this.sipno;
                console.log(this.sipno);
                SearchInfo(this.params).then(res => { console.log(res.data); this.verlist = res.data.Table }).catch(function (error) { console.log(error) })
            },
            version() {
                //this.search_sip();
            }
        },
        methods: {
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

            get_sip() {
                this.params.mode = "search_iqcsipcount";
                console.log(this.params);
                if (this.params != "") {
                    SearchInfo(this.params)
                        .then(res => {
                            console.log(res.data)
                            if (res.data.Table[0].cou_sip != 1 && res.data.Table[0].sou_ver != 1) {
                                this.selectdisplay = "block";
                                this.params.mode = "search_siplist";
                                SearchInfo(this.params).then(res => { console.log(res.data); this.siplist = res.data.Table }).catch(function (error) { console.log(error) })
                            }
                            else {
                                this.selectdisplay = "none";
                                //查询sipno和version
                                this.params.mode = "search_sipver"
                                SearchInfo(this.params)
                                    .then(res => {
                                        this.sipno = res.data.Table[0].sipno;
                                        this.version = res.data.Table[0].version;
                                        this.selectdisplay = "block";
                                        console.log(res.data)
                                    })
                                    .catch(function (error) { console.log(error) })
                            }
                        })
                        .catch(function (error) { console.log(error) })
                }

            },

            search_sip() {
                this.tablename = [];
                this.tablename2 = [];
                this.params.mode = "search_iqcsip";
                this.params.sipno = this.sipno;
                this.params.version = this.version
                console.log(this.params);
                this.loading1 = true;
                SearchInfo(this.params)
                    .then(res => {
                        this.currentPage = 1;
                        this.current_change(1);
                        this.pageshow = false;
                        this.$nextTick(() => {//重新渲染分页
                            this.pageshow = true;
                        });
                        this.loading1 = false;
                        this.desc = res.data.Table.splice(0, 1)[0];

                        this.tabledata = res.data.Table;
                        this.total = res.data.Table.length;

                        for (var key in res.data.Table[0]) {
                            if (key != "begindate") {
                                if (key == "日期") {
                                    this.tablename.push({ label: key, width: "100px" });
                                }
                                else if (key == "lot") {
                                    this.tablename.push({ label: key, width: "120px" });
                                }
                                else {
                                    var name = key;
                                    console.log(name);
                                    this.tablename2.push({ label: key, width: "80px", cou_name: this.desc[name] });
                                }
                            }
                            else {
                            }

                        }
                        console.log(this.tablename2);
                    })
                    .catch(function (error) { console.log(error) })

            },

            handle_show() {
                console.log("1");
            },

            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                // if (rowIndex === 0) {
                //     if (columnIndex === 0) {
                //         return [1, 2];
                //     } else if (columnIndex === 1) {
                //         return [0, 0];
                //     }
                // }
            },

            handle_cellstyle({ row, column, rowIndex, columnIndex }) {
                // if (rowIndex == 0) {
                //     if (columnIndex == 0) {
                //         return 'success-cell';
                //     }
                //     else {
                //         return 'error-cell'
                //     }
                // }
                // return '';

            }
        }
    }
</script>

<style>
    .error-cell {
        background: rgb(214, 214, 214);

    }

    .success-cell {
        text-align: center;
        pointer-events: none;
    }

    .tabletrace2 thead.is-group th {
        background-color: rgb(97, 179, 255);
        color: white;
    }
</style>