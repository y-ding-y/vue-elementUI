<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <el-card>
                    <el-form inline lable-width="80px">
                        <el-form-item label="供应商名称">
                            <el-input v-model="search_name" style="width: 200px;"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="handle_search">Search</el-button>
                            <el-button type="primary" icon="el-icon-refresh" @click="handle_reset"> Reset</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="handle_add">Add</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="tabledata.slice((currentpage-1)*pagesize,currentpage*pagesize)" border v-loading="loading1">
                        <el-table-column label="序號" align="center" width="50px">
                            <template slot-scope="scope">
                                <span v-text="getIndex(scope.$index)"> </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="vendorcode" label="编号"></el-table-column>
                        <el-table-column prop="vendorname" label="供应商名称"> </el-table-column>
                        <el-table-column label="Action">
                            <template slot-scope="{row}">
                                <!-- <el-button @click="handle_edit" icon="el-icon-edit" type="primary" circle plain>
                                </el-button> -->
                                <!-- <el-button @click="handle_delete(row)" icon="el-icon-delete" type="danger" circle plain>
                                </el-button> -->

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

        <el-dialog :visible.sync="dialogshow" title="新增">
            <div style="margin: 0 auto;width: 35%;">
                <el-form label-width="110px">
                    <el-form-item label="供应商编号">
                        <el-input style="width: 200px;" v-model.trim="vcode">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="供应商名称">
                        <el-input style="width: 200px;" v-model.trim="vname"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger" icon="el-icon-close" @click="handle_cancel"> 取消 </el-button>
                <el-button type="success" icon="el-icon-check" @click="add_vendoecode">
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

                vcode: "",
                vname: "",
                dialogshow: false,
                search_name: "",
                loading1:false,
            }
        },
        created() {
            this.Get_Vendor();
        },
        methods: {
            Get_Vendor() {
                var params = {
                    mode: "Get_vendor",
                }
                this.loading1=true;
                GetInfo(params)
                    .then(res => {
                        this.loading1=false;
                        this.tabledata = res.data.Table;
                        this.total = res.data.Table.length;
                        this.currentPage = 1;
                        this.current_change(1);
                        this.pageshow = false;
                        this.$nextTick(() => {//重新渲染分页
                            this.pageshow = true;
                        });
                    })
                    .catch(function (error) { console.log(error) })
            },

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

            handle_add() {
                this.dialogshow = true;
            },

            handle_cancel() {
                this.dialogshow = false;
            },

            add_vendoecode() {
                var params = {
                    mode: "add_vendor",
                    vendorcode: this.vcode,
                    vendorname: this.vname
                }
                AddInfo(params)
                    .then(res => {
                        if (res.data > 0) {
                            this.dialogshow = false;
                            this.Get_Vendor();
                            this.vcode = "";
                            this.vname = "";
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
            },

            handle_delete(row) {
                var params = {
                    mode: "delete_vendor",
                    vendorcode: row.vendorcode,
                    vendorname: row.vendorname
                }
                console.log(params);
                DeleteInfo(params)
                    .then(res => {
                        if (res.data > 0) {
                            this.Get_Vendor();
                            this.$message({ message: "删除成功", type: "success" })
                        }
                        else {
                            this.$message({ message: "删除失败", type: "error" })
                        }
                    })
                    .catch(function (error) { console.log(error) })
            },

            handle_search() {
                var params = {
                    mode: "search_vendor",
                    vendorname: this.search_name
                }
                SearchInfo(params)
                    .then(res => {
                        this.tabledata = res.data.Table;
                        this.total = res.data.Table.length;
                        this.currentPage = 1;
                        this.current_change(1);
                        this.pageshow = false;
                        this.$nextTick(() => {
                            this.pageshow = true;
                        })
                    })
            },

            handle_reset() {
                this.Get_Vendor();
                this.search_name = "";
                this.currentPage = 1;
                this.current_change(1);
                this.pageshow = false;
                this.$nextTick(() => {
                    this.pageshow = true;
                })
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