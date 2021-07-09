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
                            <el-select v-model="line" v-loading="listload">
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
                    </el-form>

                    <el-table :data="tabledata" v-loading="loading1" border stripe>
                        <!-- <el-table-column label="日期" prop="M_Date"></el-table-column>
                        <el-table-column label="產線" prop="LineID"></el-table-column>
                        <el-table-column label="班別" prop="CLass"></el-table-column> -->
                        <el-table-column label="班別描述">
                            <template slot-scope="{row}">
                                <el-select v-if="row.isaction" v-model="form['classno']">
                                    <el-option v-for="item in classlist" :value="item.ClassNO" :key="item.ClassNO"
                                        :label="item.StartTime+'-'+item.EndTime">
                                        {{item.StartTime}}-{{item.EndTime}}
                                    </el-option>
                                </el-select>
                                <span v-else> {{row.StartTime}}-{{row.EndTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="計劃量">
                            <template slot-scope="{row}">
                                <el-input v-if="row.isaction" v-model.trim="form['plancou']"
                                    oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                                <span v-else> {{row.Plant_Quantity}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="創建人">
                            <template slot-scope="{row}">
                                <el-input v-if="row.isaction" v-model="form['userid']" disabled></el-input>
                                <span v-else> {{row.CreateUser}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="創建日期">
                            <template slot-scope="{row}">
                                <el-input v-if="row.isaction" v-model="form['createdate']" disabled></el-input>
                                <span v-else> {{row.createtime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isaction">
                                    <el-button type="success" icon="el-icon-check" size="mini" circle plain
                                        @click="status=='add'?handle_save(scope.row):handle_update(scope.row)">
                                    </el-button>
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle plain
                                        @click="handle_cancel(scope.row,scope.$index)"></el-button>
                                </div>
                                <div v-else>
                                    <!-- <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                        @click="handle_edit(scope.row)"></el-button> -->
                                    <el-popconfirm title="确定删除吗？" @onConfirm="handle_delete(scope.row)">
                                        <el-button slot="reference" icon="el-icon-delete" circle type="danger"
                                            size="mini" plain></el-button>
                                    </el-popconfirm>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="el-table-add-row" style="width: 99.2%;" @click="handle_add()"><span>+ 添加</span></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { AddInfo, SearchInfo, GetInfo, DeleteInfo, UpdateInfo, DownLoad } from '@/api/index.js'
    export default {
        data() {
            return {
                tabledata: [],

                listload: false,
                linelist: "",
                line: "",
                classno: "",
                begindate: "",
                loading1: false,
                form: "",
                status: "",
                temp: "",
                classlist: "",
                date: ""
            }
        },
        watch: {
            begindate() { this.serch_classno(this.classno, this.begindate, this.line); this.tabledata = []; },
            classno() { this.serch_classno(this.classno, this.begindate, this.line); this.tabledata = []; },
            line() { this.serch_classno(this.classno, this.begindate, this.line); this.tabledata = []; }
        },
        mounted: function () {
            let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
            this.timer = setInterval(() => {
                _this.date = this.getTime(); // 修改数据date
            }, 1000)

        },
        created() {
            this.get_line();
        },
        methods: {
            getTime() {
                var date1 = new Date();
                var year = date1.getFullYear();
                var month = date1.getMonth() + 1;
                var day = date1.getDate();
                var hours = date1.getHours();
                var minutes = date1.getMinutes();
                var seconds = date1.getSeconds();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                return year + "年" + month + "月" + day + "日" + "   " + hours + ":" + minutes + ":" + seconds
            },

            //查詢班別
            serch_classno(classno, begindate, lineid) {
                var params = {
                    mode: "search_classno",
                    classno: classno,
                    lineid: lineid,
                    begindate: begindate
                };
                SearchInfo(params)
                    .then(res => {
                        this.classlist = res.data.Table;
                    })
                    .catch(error => { console.log(error) })
            },

            //獲取產線
            get_line() {
                var params = {
                    mode: "Get_Line"
                }
                this.listload = true;
                GetInfo(params)
                    .then(res => {
                        this.listload = false;
                        this.linelist = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })
            },

            handle_search() {
                if (this.classno != "" && this.begindate != "" && this.line != "") {
                    var params = {
                        mode: "search_woplan",
                        classno: this.classno,
                        lineid: this.line,
                        begindate: this.begindate
                    }
                    this.loading1 = true;
                    SearchInfo(params)
                        .then(res => {
                            this.loading1 = false;
                            var model = res.data;
                            for (var i = 0; i < model.Table.length; i++) {
                                model.Table[i].isaction = false;
                            }
                            this.tabledata = model.Table;
                        })
                        .catch(error => { console.log(error) })
                }
                else {
                    this.$message({ message: "有項目為空", type: "warning" });
                }
            },

            handle_reset() {
                this.begindate = "";
                this.line = "";
                this.classno = "";
                this.tabledata = [];
            },

            handle_add() {
                this.status = "add";
                for (var i of this.tabledata) {
                    if (i.isaction) {
                        return this.$message({ message: "请先保存当前编辑项", type: "warning" })
                    }
                }
                this.serch_classno(this.classno, this.begindate, this.line);
                if (this.classno != "" && this.begindate != "" && this.line != "") {
                    if (this.classlist.length > 0) {
                        var j = { "classno": "", "plancou": "", "userid": sessionStorage.getItem("userid"), "createdate": this.date, "isaction": true };
                        this.tabledata.push(j)
                        console.log(j);
                        this.form = JSON.parse(JSON.stringify(j));
                    }
                    else {
                        this.$message({ message: "該班別所有節課都已維護", type: "warning" });
                    }
                }
                else {
                    this.$message({ message: "請先選擇日期產線班別", type: "warning" })
                }

            },

            handle_save(row) {
                console.log(this.form);
                this.form.begindate = this.begindate;
                this.form.lineid = this.line;
                this.form.class = this.classno;
                this.form.mode = "add_woplan";
                AddInfo(this.form)
                    .then(res => {
                        if (res.data > 0) {
                            this.$message({ message: "新增成功", type: "success" })
                            this.handle_search();
                        }
                        else {
                            this.$message({ message: "新增失败", type: "error" })
                        }
                    })
                    .catch(error => { console.log(error) })
            },

            handle_update(row) { },

            handle_cancel(row, index) {
                if (this.status == "add") {
                    this.tabledata.splice(index, 1);
                }
                else if (this.status == "update") {
                    console.log(this.temp);
                    console.log(this.form);
                    this.form = JSON.parse(JSON.stringify(row));
                    console.log(row);
                }
                row.isaction = false;
            },

            handle_edit(row) {

            },

            handle_delete(row) {
                console.log(row);
                var params = {
                    mode: "delete_woplan",
                    m_date: row.M_Date,
                    lineid: row.LineID,
                    class: row.CLass,
                    classno: row.ClassNO,
                };
                DeleteInfo(params)
                    .then(res => {
                        if (res.data > 0) {
                            this.$message({ message: "删除成功", type: "success" })
                            this.serch_classno(this.classno, this.begindate, this.line);
                            this.handle_search();
                        }
                        else {
                            this.$message({ message: "删除失败", type: "error" })
                        }
                    })
                    .catch(error => { console.log(error) })
            }
        }

    }
</script>


<style>
    .el-table-add-row {
        margin-top: 10px;
        width: 100%;
        height: 34px;
        border: 1px dashed #c1c1cd;
        border-radius: 3px;
        cursor: pointer;
        justify-content: center;
        display: flex;
        line-height: 34px;
    }
</style>