<template>
    <div>
        <el-row>
            <el-col>
                <el-card>
                    <el-form inline label-width='80px'>
                        <el-form-item label="FGSN">
                            <el-input v-model="searchsn"></el-input>
                        </el-form-item>
                        <el-form-item label="产线">
                            <el-select v-model="line">
                                <el-option v-for="item in searchline" :value="item.LineID" :label="item.LineDesc"
                                    :key="item.LineID"></el-option>
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
                        <el-form-item label=" ">
                            <el-button type="primary" icon="el-icon-search" @click="handle_search">Search</el-button>
                            <el-button type="primary" icon="el-icon-refresh" @click="handle_refresh">Reset</el-button>
                            <el-button type="success" icon="el-icon-download" @click="handle_down">Down Excel
                            </el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="handle_save">Add</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :data="tabledata.slice((currentPage-1)*pagesize,currentPage*pagesize)" border
                        v-loading="tableloading">
                        <el-table-column label="序號" align="center" width="50px">
                            <template slot-scope="scope">
                                <span v-text="getIndex(scope.$index)"> </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="SN" label="FGSN" width="95px"></el-table-column>
                        <el-table-column prop="LINEID" label="产线" width="80px"></el-table-column>
                        <el-table-column prop="GLASS_NO" label="玻璃編號" width="80px"></el-table-column>
                        <el-table-column prop="DIS_NO" label="DISK編號" width="100px"></el-table-column>
                        <el-table-column prop="DISC_REV" label="Disc版本" width="150px"></el-table-column>
                        <el-table-column prop="OILlength" label="油液位長度" width="90px"></el-table-column>
                        <!-- <el-table-column prop="RESULT" label="結果" width="80px"></el-table-column> -->
                        <el-table-column label="結果" width="80px">
                            <template slot-scope="{row}">
                                <span v-if="row.RESULT=='FAIL'">
                                    <el-tag type="danger">
                                        FAIL
                                    </el-tag>
                                </span>
                                <span v-if="row.RESULT=='PASS'">
                                    <el-tag type="success">
                                        PASS
                                    </el-tag>
                                </span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="ERRORTYPE" label="不良類型"></el-table-column> -->
                        <el-table-column prop="C_Name" label="不良類型"></el-table-column>
                        <el-table-column prop="Dlevel" label="油液位判定等級" width="110px" align="center"></el-table-column>
                        <el-table-column prop="Operator" label="操作員" width="90px"></el-table-column>
                        <!-- <el-table-column prop="CreateDate" label="創建日期" width="160px"></el-table-column> -->
                        <el-table-column prop="Modifyuser" label="修改員" width="90px"></el-table-column>
                        <!-- <el-table-column prop="ModifyDate" label="日期" width="160px"></el-table-column> -->
                        <el-table-column prop="datetime" label="日期" width="160px"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="{row}">
                                <el-button icon="el-icon-edit" circle type="primary" size="mini" plain
                                    @click="edit(row)"> </el-button>
                                <el-popconfirm title="确定删除吗？" @onConfirm="handle_delete(row)">
                                    <el-button slot="reference" icon="el-icon-delete" circle type="danger" size="mini"
                                        plain></el-button>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="text-align: center;margin-top: 30px;">
                        <el-pagination @size-change="handleSizeChange" @current-change="current_change"
                            :page-sizes="[10, 20, 30, 50]" :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog :visible.sync="dialogshow" :title="textMap[dialogStatus]">
            <div style="margin: 0 auto;width: 35%;">
                <el-form label-width="110px">
                    <el-form-item label="產品SN">
                        <el-input style="width: 200px;" v-model.trim="sn" :disabled="sndisabled" @blur="get_discrev">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="產線">
                        <el-select v-model.trim="lineid" style="width: 200px;" v-loading="listload">
                            <el-option v-for="item in linelist" :key="item.GUID" :value="item.LineID"
                                :label="item.LineDesc"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="玻璃編號">
                        <el-input style="width: 200px;" v-model.trim="glass"></el-input>
                    </el-form-item>
                    <el-form-item label="DISK編號">
                        <el-input style="width: 200px;" v-model.trim="disk"></el-input>
                    </el-form-item>
                    <el-form-item label="Disc版本">
                        <el-input disabled v-model.trim="disc_rev" style="width: 200px;" v-loading="discload">
                        </el-input>
                        <br>
                        <span v-if="this.restitle" style="color: red;font-size: 10px;">*{{restitle}}</span>
                    </el-form-item>
                    <el-form-item label="油液位判定等級">
                        <el-select v-model.trim="level">
                            <el-option value="A">A</el-option>
                            <el-option value="B">B</el-option>
                            <el-option value="C">C</el-option>
                            <el-option value="T">T</el-option>
                            <el-option value="X">X</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="油液位長度">
                        <el-input style="width: 100px;" v-model.trim="oillength"
                            oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input><span>mm</span>
                    </el-form-item>
                    <el-form-item label="外觀判定">
                        <el-radio-group v-model.trim="res">
                            <el-radio label="PASS">良品</el-radio>
                            <el-radio label="FAIL">不良品</el-radio>
                        </el-radio-group>
                        <el-form-item label="">
                            <div v-bind:style="{display:discode}">
                                <el-select v-loading="codeload" v-model.trim="code" multiple>
                                    <el-option v-for="item in codelist" :key="item.Code" :value="item.Code"
                                        :label="item.C_Name"> </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger" icon="el-icon-close" @click="handle_cancel"> 取消 </el-button>
                <!-- <el-button type="success" icon="el-icon-check" @click="handle_edit"> OK </el-button> -->
                <el-button type="success" icon="el-icon-check" @click="dialogStatus==='add'?handle_add():handle_edit()">
                    OK
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { AddInfo, SearchInfo, GetInfo, DeleteInfo, UpdateInfo, DownLoad } from '@/api/index.js'
    export default {
        data() {
            return {
                line: "",
                searchline: "",
                lineid: "",
                linelist: "",
                codelist: "",
                code: [],
                res: "",
                disk: "",
                glass: "",
                sn: "",
                level: "",
                searchsn: "",
                first: "",
                second: "",
                disc_rev: "",
                oillength: "",

                old_lineid: "",
                old_disk: "",
                old_glass: "",
                old_level: "",
                old_res: "",
                old_code: "",
                old_oillength: "",
                old_discrev: "",

                listload: false,
                codeload: false,
                tabledata: [],
                discode: "none",
                sndisabled: false,
                restitle: "",
                total: 0,
                pagesize: 10,
                currentPage: 1,
                dialogshow: false,
                tableloading: false,
                selectdis: false,
                discload: false,
                dialogStatus: '',
                textMap: {
                    update: '修改',
                    add: '新增'
                },

            }
        },
        created() {
            this.get_line();
            this.get_code();
            this.Get_OQC();
        },
        watch: {
            res() {
                if (this.res == "PASS") {
                    this.discode = "none";
                    this.code = "";
                }
                if (this.res == "FAIL") {
                    this.discode = "block";

                }
            },

        },
        methods: {
            //獲取產線
            get_line() {
                var params = {
                    mode: "Get_Line"
                }
                this.listload = true;
                GetInfo(params)
                    .then(res => {
                        this.listload = false;
                        console.log(res.data);
                        this.linelist = res.data.rows;
                        this.searchline = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) })
            },

            //獲取不良代碼
            get_code() {
                var params = {
                    mode: "Get_Code"
                }
                this.codeload = true;
                GetInfo(params)
                    .then(res => {
                        this.codeload = false;
                        console.log(res.data);
                        this.codelist = res.data.rows;
                    })
                    .catch(function (error) { console.log(error) });
            },

            //
            Get_OQC() {
                var params = {
                    mode: "Get_oqc"
                }
                this.tableloading = true;
                GetInfo(params)
                    .then(res => {
                        this.tableloading = false;
                        console.log(res.data);
                        this.tabledata = res.data.Table
                        this.total = res.data.Table.length;
                    })
                    .catch(function (error) { console.log(error) })
            },

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
            handle_cancel() {
                this.dialogshow = false;
            },
            getIndex($index) {  //表格序号 
                return ((this.currentPage - 1) * this.pagesize + $index + 1)
            },

            //保存
            handle_add() {
                var str = "";
                for (var i = 0; i < this.code.length; i++) {
                    str = str + this.code[i] + ",";
                }
                var params = {
                    mode: "Add_oqc",
                    sn: this.sn,
                    lineid: this.lineid,
                    glass: this.glass,
                    disk: this.disk,
                    res: this.res,
                    code: str,
                    user: sessionStorage.getItem('userid') == null ? "" : sessionStorage.getItem('userid'),
                    level: this.level,
                    disc_rev: this.disc_rev,
                    oillength: this.oillength,
                };
                if (this.level != "" && this.sn != "" && this.glass != "" && this.lineid != "" && this.oillength != "") {
                    if (this.res == "FAIL" && this.code.length == 0) {
                        this.$message({ message: "請選擇外觀不良類型", type: "error" })
                    }
                    else if (this.res != "") {
                        AddInfo(params)
                            .then(res => {
                                if (res.data > 0) {
                                    this.Get_OQC();
                                    this.dialogshow = false;
                                    this.$message({ message: "新增成功", type: "success" });
                                    this.sn = "";
                                    this.disk = "";
                                    this.glass = "";
                                    this.lineid = "";
                                    this.res = "";
                                    this.code = [];
                                    this.level = "";
                                    this.oillength = "";
                                    this.disc_rev = "";
                                }
                                else if (res.data == -1) {
                                    this.$message({ message: "已存在", type: "error" });
                                }
                                else {
                                    this.$message({ message: "新增失敗", type: "error" });
                                }
                            })
                    }
                    else {
                        this.$message({ message: "請選擇外觀判定", type: "warning" })
                    }

                }
                else {
                    this.$message({ message: "有項目為空", type: "warning" })
                }

            },
            handle_save() {
                this.dialogStatus = "add";
                this.dialogshow = true;
                this.sndisabled = false;
                this.sn = "";
                this.disk = "";
                this.glass = "";
                this.lineid = "";
                this.res = "";
                this.code = [];
                this.discode = "none";
                this.level = "";
                this.disc_rev = "";
                this.oillength = "";
            },

            //刪除
            handle_delete(row) {
                var params = {
                    mode: "delete_oqc",
                    sn: row.SN,
                    lineid: row.LINEID,
                    glass: row.GLASS_NO,
                    disk: row.DIS_NO,
                    res: row.RESULT,
                    code: row.ERRORTYPE,
                    level: row.Dlevel
                };
                DeleteInfo(params)
                    .then(res => {
                        if (res.data > 0) {
                            this.$message({ message: "刪除成功", type: "success" });
                            this.Get_OQC();
                        }
                        else {
                            this.$message({ message: "刪除失敗", type: "error" });
                        }
                    })
                    .catch(function (error) { console.log(error) })
            },

            //修改
            edit(row) {
                this.sndisabled = true;
                this.dialogStatus = "update";
                this.dialogshow = true;
                this.sn = row.SN;
                this.disk = row.DIS_NO;
                this.glass = row.GLASS_NO;
                this.lineid = row.LINEID;
                this.res = row.RESULT;
                this.code = [];
                this.code.push(row.ERRORTYPE);
                this.level = row.Dlevel;
                this.oillength = row.OILlength;
                this.disc_rev = row.DISC_REV;
                this.restitle = "";
                this.old_disk = row.DIS_NO;
                this.old_lineid = row.LINEID;
                this.old_glass = row.GLASS_NO;
                this.old_level = row.Dlevel;
                this.old_code = row.ERRORTYPE;
                this.old_res = row.RESULT;
                this.old_oillength = row.OILlength;
                this.old_discrev = row.DISC_REV;
            },

            //保存修改
            handle_edit() {
                console.log(this.code.length);
                if (this.code.length > 1) {
                    this.$message({ message: "只能選擇一項不良", type: "warning" })
                }
                else {
                    var params = {
                        mode: "update_disc",
                        sn: this.sn,
                        disk: this.disk,
                        old_disk: this.old_disk,
                        lineid: this.lineid,
                        old_lineid: this.old_lineid,
                        glass: this.glass,
                        old_glass: this.old_glass,
                        level: this.level,
                        old_level: this.old_level,
                        res: this.res,
                        old_res: this.old_res,
                        code: this.code[0],
                        old_code: this.old_code,
                        user: sessionStorage.getItem('userid') == null ? "" : sessionStorage.getItem('userid'),
                        old_oillength: this.old_oillength,
                        oillength: this.oillength,
                        disc_rev: this.disc_rev,
                        old_discrev: this.old_discrev,
                    };
                    UpdateInfo(params)
                        .then(res => {
                            if (res.data > 0) {
                                this.dialogshow = false;
                                this.$message({ message: "修改成功", type: "success" });
                                this.Get_OQC();
                            }
                            else if (res.data == -1) {
                                this.$message({ message: "修改項目已存在", type: "warning" })
                            }
                            else {
                                this.$message({ message: "修改失败", type: "error" })
                            }
                        })
                        .catch(function (error) { console.log(error) })

                }

            },

            //查詢
            handle_search() {
                var params = {
                    mode: "search_oqc",
                    sn: this.searchsn,
                    first: this.first,
                    second: this.second,
                    lineid: this.line
                }

                if (this.first > this.second) {
                    this.$message({ message: "开始日期不能大于结束日期", type: "warning" })
                }
                else {
                    this.tableloading = true;
                    SearchInfo(params)
                        .then(res => {
                            this.tableloading = false;
                            this.total = res.data.Table.length;
                            this.tabledata = res.data.Table;
                        })
                        .catch(function (error) { console.log(error) })
                }

            },

            //重置
            handle_refresh() {
                this.searchsn = "";
                this.first = "";
                this.second = "";
                this.Get_OQC();
                this.line = "";
            },

            //下载
            handle_down() {

                if (this.first > this.second) {
                    this.$message({ message: "开始日期不能大于结束日期", type: "warning" })
                }
                else {
                    var date = new Date(); //实例化一个时间对象
                    var year = date.getFullYear(); //获取年
                    var month = date.getMonth() + 1; //获取月份，因为是0-11.所以要加上1
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    var strpath = year + "-" + month + "-" + day + "-" + " " + hour + ":" + minute + ":" + second;//excel文件名 
                    let elink = document.createElement('a');
                    elink.href = "api/DownManage?mode=down_oqc&sn=" + this.searchsn + "&first=" + this.first + "&second=" + this.second;
                    console.log(elink.href);
                    elink.download = strpath + ".xls";
                    elink.click();
                }
            },

            //获取disc_rev
            get_discrev() {
                var params = {
                    mode: "get_discrev",
                    sn: this.sn
                };
                this.disc_rev = "";
                this.restitle = "";

                console.log(params);
                if (this.sn != "") {
                    this.discload = true;
                    SearchInfo(params)
                        .then(res => {
                            this.discload = false;
                            this.disc_rev = res.data.split("|")[0];
                            this.restitle = res.data.split("|")[1];
                        })
                        .catch(function (error) { console.log(error) })
                }

            },
        }
    }
</script>

<style>
    .el-dialog__header {
        border-bottom: 1px solid rgb(155, 154, 154);
    }

    .el-dialog__footer {
        border-top: 1px solid rgb(155, 154, 154);
    }
</style>