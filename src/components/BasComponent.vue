<template>
    <div>
        <el-row>
            <el-col>
                <el-card>
                    <el-form inline label-width="100px">
                        <el-form-item label="物料共用名称">
                            <el-input v-model="search_name" style="width: 200px;"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="handle_search">Search</el-button>
                            <el-button type="primary" icon="el-icon-refresh" @click="handle_reset"> Reset</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="handle_add">Add</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="tabledata.slice((currentpage-1)*pagesize,currentpage*pagesize)" border
                        v-loading="loading1">
                        <el-table-column label="序號" align="center" width="50px">
                            <template slot-scope="scope">
                                <span v-text="getIndex(scope.$index)"> </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="componentitem" label="物料编号"></el-table-column>
                        <el-table-column prop="componentname" label="物料共用名称"></el-table-column>
                        <el-table-column prop="type" label="类型"></el-table-column>
                        <el-table-column prop="name" label="物料完整名称"></el-table-column>
                        <el-table-column prop="ismaterial" label="是否物料"></el-table-column>
                        <el-table-column label="Action">
                            <template slot-scope="{row}">
                                <el-button @click="handle_edit(row)" icon="el-icon-edit" type="primary" circle plain size="mini">
                                </el-button>
                                <el-popconfirm title="确定删除吗？" @onConfirm="handle_delete(row)">
                                    <el-button slot="reference" icon="el-icon-delete" circle type="danger" size="mini"
                                        plain></el-button>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="text-align: center;margin-top:30px;">
                        <el-pagination @size-change="handlesizechange" @current-change="current_change" v-if="pageshow"
                            :page-sizes="[10,20,30,50]" :page-size="pagesize"
                            layout="total,sizes,prev,pager,next,jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog :visible.sync="dialogshow" :title="textMap[dialogStatus]">
            <div style="margin: 0 auto;width: 35%;">
                <el-form label-width="110px">
                    <el-form-item label="物料编号">
                        <el-input style="width: 200px;" v-model.trim="componentitem" :disabled="itemdisabled">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="物料共用名称">
                        <el-input style="width: 200px;" v-model.trim="componentname"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-input style="width: 200px;" v-model.trim="type"></el-input>
                    </el-form-item>
                    <el-form-item label="物料完整名称">
                        <el-input style="width: 200px;" v-model.trim="name"></el-input>
                    </el-form-item>
                    <el-form-item label="IsMaterial">
                        <el-radio-group v-model.trim="ismaterial">
                            <el-radio label="Y">Y</el-radio>
                            <el-radio label="N">N</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger" icon="el-icon-close" @click="handle_cancel"> 取消 </el-button>
                <!-- <el-button type="success" icon="el-icon-check" @click="handle_edit"> OK </el-button> -->
                <el-button type="success" icon="el-icon-check"
                    @click="dialogStatus==='add'?add_component():edit_component()">
                    OK
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { SearchInfo, GetInfo, UpdateInfo, AddInfo, DeleteInfo } from '@/api/index.js'

    export default {
        data() {
            return {
                tabledata: [],
                pagesize: 10,
                total: 0,
                currentpage: 1,
                pageshow: false,

                search_name: "",

                componentitem: "",
                componentname: "",
                type: "",
                name: "",
                ismaterial: "Y",

                textMap: {
                    update: '修改',
                    add: '新增'
                },
                loading1: false,
                dialogshow: false,
                dialogStatus: "",
                itemdisabled: false,
            }
        },
        created() {
            this.Get_component();
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

            Get_component() {
                var params = {
                    mode: "Get_componentitem",
                }
                this.loading1 = true;
                GetInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        var model = res.data.Table;
                        this.tabledata = model;
                        this.total = model.length;
                        this.currentpage = 1;
                        this.current_change(1);
                        this.pageshow = false;
                        this.$nextTick(() => {
                            this.pageshow = true;
                        })
                    })
            },

            handle_search() {
                var params = {
                    mode: "search_componentname",
                    componentname: this.search_name
                }
                this.loading1 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        var model = res.data.Table;
                        this.tabledata = model;
                        this.total = model.length;
                        this.currentpage = 1;
                        this.current_change(1);
                        this.pageshow = false;
                        this.$nextTick(() => {
                            this.pageshow = true;
                        })
                    })
                    .catch(function (error) { console.log(error) })
            },

            handle_reset() {
                this.search_name = "";
                this.Get_component();
            },

            handle_add() {
                this.dialogshow = true;
                this.itemdisabled = false;
                this.dialogStatus = "add";
                this.componentitem = "";
                this.componentname = "";
                this.type = "";
                this.name = "";
                this.ismaterial = "Y"
            },

            handle_delete(row) {
                var params = {
                    mode: "delete_component",
                    componentitem: row.componentitem
                }
                DeleteInfo(params)
                    .then(res => {
                        if (res.data > 0) {
                            this.Get_component();
                            this.$message({ message: "删除成功", type: "success" })
                        }
                        else {
                            this.$message({ message: "删除失败", type: "error" })
                        }
                    })
                    .catch(function (error) { console.log(error) })
            },

            handle_edit(row) {
                this.dialogshow = true;
                this.dialogStatus = "update";
                this.itemdisabled = true;
                this.componentitem = row.componentitem;
                this.componentname = row.componentname;
                this.name = row.name;
                this.type = row.type;
                this.ismaterial = row.ismaterial
            },

            handle_cancel() {
                this.dialogshow = false;
            },

            add_component() {
                var params = {
                    mode: "add_component",
                    componentitem: this.componentitem,
                    componentname: this.componentname,
                    type: this.type,
                    name: this.name,
                    ismaterial: this.ismaterial
                }

                if (this.componentitem != "") {
                    AddInfo(params)
                        .then(res => {
                            if (res.data > 0) {
                                this.dialogshow = false;
                                this.Get_component();
                                this.$message({ message: "新增成功", type: "success" })
                            }
                            else if (res.data = -1) {
                                this.$message({ message: "重复新增", type: "warning" })
                            }
                            else {
                                this.$message({ message: "新增失败", type: "error" })
                            }
                        })
                        .catch(function (error) { console.log(error) })
                }
                else {
                    this.$message({ message: "物料编号不能为空", type: "error" })
                }
            },

            edit_component() {
                var params = {
                    mode: "update_component",
                    componentitem: this.componentitem,
                    componentname: this.componentname,
                    type: this.type,
                    name: this.name,
                    ismaterial: this.ismaterial
                };
                UpdateInfo(params)
                    .then(res => {
                        if (res.data > 0) {
                            this.Get_component();
                            this.dialogshow = false;
                            this.$message({ message: "修改成功", type: "success" })
                        }
                        else {
                            this.$message({ message: "修改失败", type: "error" })
                        }
                    })
                    .catch(function (error) { console.log(error) })
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