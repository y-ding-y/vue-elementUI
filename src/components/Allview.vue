<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card>
                    <el-form inline label-width="80px">
                        <el-form-item label="日期">
                            <el-date-picker v-model="begindate" type="date" placeholder="选择日期"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="產線">
                            <el-select v-model="lineid">
                                <el-option v-for="item in linelist" :value="item.LineID" :label="item.LineDesc"
                                    :key="item.LineID"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="班別">
                            <el-select v-model="classno">
                                <el-option value="D" label="白班">白班</el-option>
                                <el-option value="N" label="夜班">夜班</el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="handle_search">Search</el-button>
                            <el-button type="primary" icon="el-icon-refresh" @click="handle_reset">Refresh</el-button>
                        </el-form-item>
                        <br>
                        <el-form-item label="定時刷新">
                            <el-input v-model.trim="input3" style="width: 80px;"
                                oninput="value=value.replace(/[^\d]/g,'')"> </el-input>/秒&nbsp;&nbsp;&nbsp;
                            <span v-if="this.status" style="color: green;">定时刷新中</span>
                            <span v-if="!this.status" style="color: red;">已停止定时刷新</span>
                            <el-button type="success" @click="handle_setsearch">開始</el-button>
                            <el-button type="danger" @click="handle_calcelsearh">結束</el-button>

                            <!-- <el-button type="primary" icon="el-icon-search" @click="">定時刷新</el-button> -->
                        </el-form-item>
                    </el-form>

                    <el-table :data="tabledata" v-loading="loading1" border class="tabletrace3"
                        :span-method="objectSpanMethod">
                        <el-table-column label="課別" align="center">
                            <template slot-scope="{row}">
                                <span v-if="row.classno!='total'">
                                    第{{row.classno}}節課<br>{{row.classdesc}}
                                </span>
                                <span v-else>
                                    Total總計：
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="workorder" label="工令" align="center"></el-table-column>
                        <el-table-column prop="versions" label="版本" align="center"></el-table-column>
                        <el-table-column prop="cou_plan" label="計劃量" align="center"></el-table-column>
                        <el-table-column prop="cou_act" label="實際量" align="center"></el-table-column>
                        <el-table-column prop="rate" label="達成率" align="center"></el-table-column>
                    </el-table>
                    <!-- <div style="text-align: center;margin-top: 30px;">
                        <el-pagination @size-change="handleSizeChange" @current-change="current_change"
                            :page-sizes="[10, 20, 30, 50]" :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div> -->
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { SearchInfo, GetInfo, AddInfo, UpdateInfo, DeleteInfo } from '@/api/index.js'
    export default {
        name: "allview",
        data() {
            return {
                begindate: "",
                lineid: "",
                classno: "",
                tabledata: [],
                linelist: "",
                loading1: false,
                pos: 0,
                spanArr: [],

                pos2: 0,
                spanArr2: [],
                total: 0,
                pagesize: 10,
                currentPage: 1,
                input3: 10,
                start: "",
                status: false
            }
        },
        created() {
            this.get_linelist();
            clearInterval(this.start);
        },
        beforeDestroy() {
            if (this.start) {
                clearInterval(this.start); //关闭 
            }
        },//利用vue的生命周期函数
        methods: {
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
            get_linelist() {
                var parmas = {
                    mode: "Get_Line"
                };
                GetInfo(parmas)
                    .then(res => {
                        var model = res.data;
                        this.linelist = model.rows;
                    })
                    .catch(error => { console.log(error) })
            },

            handle_search() {
                var params = {
                    mode: "search_allview",
                    lineid: this.lineid,
                    begindate: this.begindate,
                    classno: this.classno
                };
                this.loading1 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        var model = res.data;
                        this.total = model.Table.length;
                        this.pos = 0;
                        this.spanArr = [];
                        this.pos2 = 0;
                        this.spanArr2 = [];
                        this.getSpanArr(model.Table);
                        this.tabledata = model.Table;
                    })
                    .catch(error => { console.log(error) })

                console.log(params);
            },

            getSpanArr(data) {
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0;

                        this.spanArr2.push(1);
                        this.pos2 = 0
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i].workorder === data[i - 1].workorder && data[i].classno === data[i - 1].classno) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }

                        if (data[i].classno === data[i - 1].classno) {
                            this.spanArr2[this.pos2] += 1;
                            this.spanArr2.push(0);
                        } else {
                            this.spanArr2.push(1);
                            this.pos2 = i;
                        }
                    }
                }
            },

            objectSpanMethod({ row, column, rowIndex, columnIndex }) {


                if (rowIndex == this.tabledata.length - 1) {
                    if (columnIndex === 0) {
                        return [1, 3];
                    }
                    else if (columnIndex === 1 || columnIndex === 2) {
                        return [0, 0];
                    }

                }
                else {
                    if (columnIndex === 0 || columnIndex === 3 || columnIndex === 5) {
                        const _row = this.spanArr2[rowIndex];
                        const _col = _row > 0 ? 1 : 0;
                        return {
                            rowspan: _row,
                            colspan: _col
                        }
                    }

                    if (columnIndex === 1) {
                        const _row = this.spanArr[rowIndex];
                        const _col = _row > 0 ? 1 : 0;
                        return {
                            rowspan: _row,
                            colspan: _col
                        }
                    }
                }
            },

            handle_reset() {
                this.begindate = "";
                this.lineid = "";
                this.classno = "";
                this.tabledata = [];
            },

            handle_setsearch() {
                if (this.begindate != "" && this.lineid != "" && this.classno != "") {
                    this.start = setInterval(this.handle_search, this.input3 * 1000);
                    this.status = true;
                }
                else {
                    this.$message({ message: "有项目为空", type: "error" })
                    clearInterval(this.start);
                }
            },
            handle_calcelsearh() {
                clearInterval(this.start);
                this.status = false;
            }

        }
    }
</script>

<style>
    .tabletrace3 td {
        border: 1px solid;
    }

    .tabletrace3 thead th {
        border: 1px solid rgb(77, 77, 77);
    }


    .tabletrace3 {
        border: 1px solid;
    }

    .tabletrace3 thead.is-group th {
        background-color: rgb(97, 179, 255);
        color: white;
    }
</style>