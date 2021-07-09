<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card>
                    <el-form inline label-width='80px'>
                        <el-form-item label="Wo">
                            <el-input v-model="searchwo"></el-input>
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
                            <el-button type="primary" icon="el-icon-plus" @click="handle_save">Add</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="tabledata.slice((currentPage-1)*pagesize,currentPage*pagesize)" border
                        v-loading="loading1">
                        <el-table-column prop="WO" label="工單"></el-table-column>
                        <el-table-column prop="Disc" label="Disc版本"></el-table-column>
                        <el-table-column prop="Glass" label="玻璃等級"></el-table-column>
                        <el-table-column prop="Coating" label="特殊Coating"></el-table-column>
                        <el-table-column prop="Reserve" label="預留碼"></el-table-column>
                        <el-table-column prop="Quantity" label="數量"></el-table-column>
                        <el-table-column prop="CreateUser" label="操作者"></el-table-column>
                        <el-table-column prop="CreateDate" label="日期"></el-table-column>
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
                    <el-form-item label="Wo">
                        <el-input style="width: 200px;" v-model.trim="wo" :disabled="wo_disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="Disc Revision">
                        <el-input style="width: 200px;" v-model.trim="discversion"></el-input>
                    </el-form-item>
                    <el-form-item label="玻璃等級">
                        <el-input style="width: 200px;" v-model.trim="glass"></el-input>
                    </el-form-item>
                    <el-form-item label="特殊coating">
                        <el-input style="width: 200px;" v-model.trim="coating"></el-input>
                    </el-form-item>
                    <el-form-item label="預留碼">
                        <el-input style="width: 200px;" v-model.trim="rev"></el-input>
                    </el-form-item>
                    <el-form-item label="數量">
                        <el-input style="width: 200px;" v-model.trim="quality"
                            oninput="value=value.replace(/[^\d]/g,'')"></el-input>
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
    import { SearchInfo, GetInfo, AddInfo, UpdateInfo, DeleteInfo } from '@/api/index.js'
    export default {
        data() {
            return {
                tabledata: [],
                total: 0,
                pagesize: 10,
                currentPage: 1,

                dialogshow: false,
                textMap: {
                    add: "新增",
                    update: "修改"
                },
                dialogStatus: "",

                searchwo: "",
                wo: "",
                user: "",
                discversion: "",
                glass: "",
                coating: "",
                rev: "",
                quality: 0,
                first: "",
                second: "",

                loading1: false,
                wo_disabled: false,

            }
        },
        created() {
            this.get_Wo();
        },
        methods: {
            get_Wo() {
                var params = { mode: "get_wo" }
                this.loading1 = true;
                GetInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        var model = res.data;
                        this.tabledata = model.Table;
                        this.total = model.Table.length;
                    })
                    .catch(error => { console.log(error) })
            },

            handle_add() {
                var params = {
                    mode: "add_wo",
                    wo: this.wo,
                    quality: this.quality,
                    discversion: this.discversion,
                    glass: this.glass,
                    coating: this.coating,
                    rev: this.rev,
                    userid: sessionStorage.getItem("userid"),
                }
                AddInfo(params)
                    .then(res => {
                        console.log(res);
                        if (res.data > 0) {
                            this.$message({ message: "新增成功", type: "success" })
                            this.dialogshow = false;
                            this.get_Wo();
                        }
                        else if (res.data == -1) {
                            this.$message({ message: "該新增已存在", type: "warning" })
                        }
                        else {
                            this.$message({ message: "新增失敗", type: "error" })
                        }
                    })
                    .catch(error => { console.log(error) })
            },

            handle_edit() {
                var params = {
                    mode: "update_wo",
                    wo: this.wo,
                    quality: this.quality,
                    discversion: this.discversion,
                    glass: this.glass,
                    coating: this.coating,
                    rev: this.rev,
                    userid: sessionStorage.getItem("userid")
                }
                console.log(params)
                UpdateInfo(params)
                    .then(res => {
                        if (res.data > 0) {
                            this.$message({ message: "修改成功", type: "success" });
                            this.dialogshow = false;
                            this.get_Wo();
                        }
                        else {
                            this.$message({ message: "修改失敗", type: "error" })
                        }
                    })
                    .catch(error => { console.log(error) })
            },

            handle_refresh() {
                this.searchwo = "";
                this.get_Wo();
                this.first = "";
                this.second = "";
            },

            handle_search() {
                var params = {
                    mode: "search_wo",
                    wo: this.searchwo,
                    first: this.first,
                    second: this.second
                }
                this.loading1 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        var model = res.data;
                        this.total = model.Table.length;
                        this.tabledata = model.Table;
                    })
                    .catch(error => { console.log(error) })
            },

            handle_save() {
                this.wo = "";
                this.discversion = "";
                this.glass = "";
                this.rev = "";
                this.coating = "";
                this.quality = 0;
                this.wo_disabled = false;
                this.dialogshow = true;
                this.dialogStatus = "add";
            },

            handle_cancel() {
                this.dialogshow = false;
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

            handle_delete(row) {
                var params = {
                    mode: "delete_wo",
                    wo: row.WO,
                    userid: sessionStorage.getItem("userid"),
                }
                console.log(params);
                DeleteInfo(params)
                    .then(res => {
                        if (res.data > 0) {
                            this.$message({ message: "刪除成功", type: "success" })
                            this.dialogshow = false;
                            this.get_Wo();
                        }
                        else {
                            this.$message({ message: "刪除成功", type: "success" })
                        }
                    })
                    .catch(error => { console.log(error) })
            },

            edit(row) {
                this.wo_disabled = true;
                this.dialogshow = true;
                this.wo = row.WO;
                this.glass = row.Glass;
                this.rev = row.Reserve;
                this.coating = row.Coating;
                this.quality = row.Quantity;
                this.discversion = row.Disc;
                this.dialogStatus = "update";
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