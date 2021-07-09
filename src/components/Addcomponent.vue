<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <el-card>
                    <el-form inline label-width="80px" label-position="left">
                        <el-form-item label="編號">
                            <el-input v-model="no"></el-input>
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
                            <el-button icon="el-icon-search" type="primary" @click="handle_search">Search</el-button>
                            <el-button icon="el-icon-refresh" type="primary" @click="handle_refresh">Reset</el-button>
                            <el-button icon="el-icon-plus" type="primary" @click="add_dialog">Add</el-button>
                        </el-form-item>

                    </el-form>
                    <el-table :data=" tabledata.slice((currentPage-1)*pagesize,currentPage*pagesize)" border stripe
                        v-loading="loading1">
                        <el-table-column prop="D_NO" label="編號" width="120px"> </el-table-column>
                        <el-table-column prop="D_DATE" label="日期"></el-table-column>
                        <el-table-column prop="D_TYPE" label="類別" width="120px"></el-table-column>
                        <el-table-column prop="D_LEVEL" label="等級" width="70px"></el-table-column>
                        <el-table-column prop="MIN_NUM" label="最小值" width="70px">
                            <template slot-scope="{row}">
                                <span v-if="row.D_TYPE=='注油等級'">
                                    {{row.MIN_NUM}}&nbsp;mm
                                </span>
                                <span v-if="row.D_TYPE=='熱敏電阻量測等級'">
                                    {{row.MIN_NUM}}&nbsp;ohm
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="MAX_NUM" label="最大值" width="70px">
                            <template slot-scope="{row}">
                                <span v-if="row.D_TYPE=='注油等級'">
                                    {{row.MAX_NUM}}&nbsp;mm
                                </span>
                                <span v-if="row.D_TYPE=='熱敏電阻量測等級'">
                                    {{row.MAX_NUM}}&nbsp;ohm
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="CREATEUSER" label="創建者" width="100px"></el-table-column>
                        <el-table-column prop="CREATEDATE" label="創建日期"></el-table-column>
                        <el-table-column prop="MODIFYUSER" label="修改者" width="100px"></el-table-column>
                        <el-table-column prop="MODIFYDATE" label="修改日期"></el-table-column>
                        <el-table-column label="编号新增" width="70px" align="center">
                            <template slot-scope="{row}">
                                <el-button icon="el-icon-document-add" circle type="info" size="mini" plain
                                    @click="add2(row)"></el-button> 
                            </template> 
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="{row}"> 
                                <el-button icon="el-icon-edit" circle type="primary" size="mini" plain
                                    @click="edit(row)"></el-button>

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

        <el-dialog :visible.sync="dialogshow" title="新增">
            <el-form label-width="80px" inline>
                <el-row>
                    <el-col>
                        <el-form-item label="編號">
                            <el-input v-model="d_no" style="width: 200px;" disabled> </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="日期">
                            <el-input v-model="d_date" style="width: 200px;" disabled> </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-for="(domain, index) in dynamicValidateForm.domains" :key="index">
                    <el-form-item :label="'類別'+index" :key="domain.key1">
                        <el-select v-model="domain.type" style="width: 150px;" @change="getlevellist(domain)">
                            <el-option value="熱敏電阻量測等級" label="熱敏電阻量測等級">熱敏電阻量測等級</el-option>
                            <el-option value="注油等級" label="注油等級">注油等級</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="'等級'+index" :key="domain.key2">
                        <el-select v-model="domain.level" style="width: 90px;">
                            <el-option v-for="item in domain.levellist" :key="item.level" :value="item.level"
                                :label="item.level">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="'最小值'+index" :key="domain.key3">
                        <el-input v-model="domain.min" style="width: 60px;"
                            oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
                        </el-input>
                        <span>{{domain.unit}}</span>
                    </el-form-item>
                    <el-form-item :label="'最大值'+index" :key="domain.key4">
                        <el-input v-model="domain.max" style="width: 60px;"
                            oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
                        </el-input>
                        <span>{{domain.unit}}</span>
                        <el-button icon="el-icon-plus" circle type="success" @click="addDomain"></el-button>
                        <el-button icon="el-icon-minus" circle type="danger" @click.prevent="removeDomain(domain)">
                        </el-button>
                    </el-form-item>
                </el-row>

                <!-- <el-form-item label="類別">
                    <el-select v-model="d_type" style="width: 180px;">
                        <el-option value="熱敏電阻量測等級" label="熱敏電阻量測等級">熱敏電阻量測等級</el-option>
                        <el-option value="注油等級" label="注油等級">注油等級</el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="等級">
                    <el-select v-model="d_level" style="width: 90px;">
                        <el-option v-for="item in levellist" :key="item.level" :value="item.level" :label="item.level">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最小值">
                    <el-input v-model="d_min" style="width: 60px;" oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
                    </el-input>
                    <span>{{unit}}</span>
                </el-form-item>
                <el-form-item label="最大值">
                    <el-input v-model="d_max" style="width: 60px;" oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
                    </el-input>
                    <span>{{unit}}</span>
                </el-form-item>
                <el-form-item label="">
                    <el-button icon="el-icon-plus" circle type="success" @click="addDomain"></el-button>
                </el-form-item> -->


                <el-form-item label="創建日期">
                    <el-input v-model="createdate" style="width: 200px;" disabled> </el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger" icon="el-icon-close" @click="handle_cancel"> 取消 </el-button>
                <el-button type="success" icon="el-icon-check" @click="handle_add"> OK </el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogedit" title="修改">
            <div style="margin: 0 auto;width: 35%;">
                <el-form label-width="80px">
                    <el-form-item label="編號">
                        <el-input disabled v-model="e_no" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="類別">
                        <el-input disabled v-model="e_type" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="等級">
                        <el-input disabled v-model="e_level" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="最小值">
                        <el-input v-model="e_min" style="width: 200px;"
                            oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item label="最大值">
                        <el-input v-model="e_max" style="width: 200px;"
                            oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
                    </el-form-item>


                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" icon="el-icon-close" @click="handle_cancel"> 取消 </el-button>
                <el-button type="success" icon="el-icon-check" @click="handle_edit"> OK </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { SearchInfo, AddInfo, UpdateInfo, DeleteInfo } from '@/api/index.js'
    export default {
        data() {
            return {
                no: "",
                strno: "",
                d_no: "",
                d_type: "",
                d_date: "",
                d_max: "",
                d_min: "",
                createdate: "",
                d_level: "",
                unit: "",
                i: "0",
                levellist: "",

                e_no: "",
                e_type: "",
                e_level: "",
                e_max: "",
                e_min: "",
                e_modifydate: "",

                tabledata: [],
                total: 0,
                pagesize: 10,
                currentPage: 1,

                dialogshow: false,
                loading1: false,
                dialogedit: false,

                first: "",
                second: "",

                dynamicValidateForm: {
                    domains: [{
                        type: "",
                        min: "",
                        max: "",
                        value: '',
                        level: "",
                        levellist: "",
                        unit: "",
                    }],
                }
            }
        },
        watch: {
            dynamicValidateForm() {
                for (var i = 0; i < this.dynamicValidateForm.domains.length; i++) {
                    if (this.dynamicValidateForm.domains[i].type == "注油等級") {
                        this.dynamicValidateForm.domains[i].levellist = [{ "level": "T" }, { "level": "A" }, { "level": "B" }];
                        this.dynamicValidateForm.domains[i].unit = "mm";
                    }
                    if (this.dynamicValidateForm.domains[i].type == "熱敏電阻量測等級") {
                        this.dynamicValidateForm.domains[i].levellist = [{ "level": "A" }, { "level": "B" }, { "level": "C" }, { "level": "X" }];
                        this.dynamicValidateForm.domains[i].unit = "ohm";
                    }
                }

            },
            d_type() {
                this.d_level = "";
                if (this.d_type == "注油等級") {
                    this.levellist = [{ "level": "T" }, { "level": "A" }, { "level": "B" }];
                    this.unit = "mm";
                }
                if (this.d_type == "熱敏電阻量測等級") {
                    this.levellist = [{ "level": "A" }, { "level": "B" }, { "level": "C" }, { "level": "X" }];
                    this.unit = "ohm";
                }
            },
        },
        created() {
            this.get_Disc();
        },
        methods: {
            //獲取當前日期
            get_date() {
                var aData = new Date();
                var m_year = aData.getFullYear();
                var m_month = aData.getMonth() + 1 < 10 ? ("0" + aData.getMonth() + 1) : (aData.getMonth() + 1);
                var m_day = aData.getDate() < 10 ? "0" + aData.getDate() : aData.getDate();
                var m_hours = aData.getHours() < 10 ? "0" + aData.getHours() : aData.getHours();
                var m_minutes = aData.getMinutes() < 10 ? "0" + aData.getMinutes() : aData.getMinutes();
                var m_second = aData.getSeconds() < 10 ? "0" + aData.getSeconds() : aData.getSeconds();
                this.strno = m_year + "" + m_month + "" + m_day;
                this.d_date = m_year + "-" + m_month + "-" + m_day;
                this.createdate = m_year + "-" + m_month + "-" + m_day + " " + m_hours + ":" + m_minutes + ":" + m_second;
                this.value = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate() + " " + aData.getHours() + ":" + aData.getMinutes() + ":" + aData.getSeconds();
                this.createdate = this.value;
            },

            //查詢disc
            get_Disc() {
                var params = {
                    mode: "Search_disk"
                }
                this.loading1 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        this.tabledata = res.data.rows;
                        this.total = res.data.total;
                        console.log(res.data);
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

            //顯示新增模態框
            add_dialog() {
                this.dialogshow = true;
                this.get_addcount();
                this.get_date();
            },

            add2(row) {
                this.dialogshow = true;
                this.get_date();
                this.d_no = row.D_NO;
            },


            //新增
            handle_add() {
                var len = this.dynamicValidateForm.domains.length;
                var arr = [];
                var strlevel = "";
                var strtype = "";
                var strmax = "";
                var strmin = "";
                arr = this.dynamicValidateForm.domains[len - 1]
                if (arr.level != "" && arr.type != "" && arr.min != "" && arr.max != "") {
                    if (Number(arr.min) > Number(arr.max)) {
                        this.$message({ message: "最小值不能大於最大值", type: "error" })
                    }
                    else {
                        //新增
                        for (var i = 0; i < len; i++) {
                            strlevel = strlevel + this.dynamicValidateForm.domains[i].level + ","
                            strtype = strtype + this.dynamicValidateForm.domains[i].type + ","
                            strmin = strmin + this.dynamicValidateForm.domains[i].min + ",";
                            strmax = strmax + this.dynamicValidateForm.domains[i].max + ",";
                        }
                        var params = {
                            mode: "add_disc",
                            no: this.d_no,
                            //adata: this.dynamicValidateForm.domains,
                            level: strlevel,
                            type: strtype,
                            min: strmin,
                            max: strmax,
                            user: sessionStorage.getItem('userid') == null ? "" : sessionStorage.getItem('userid')
                        }
                        AddInfo(params)
                            .then(res => {
                                if (res.data > 0) {
                                    console.log(res.data);
                                    this.$message({ message: "新增成功", type: "success" });
                                    this.get_Disc();
                                    this.dialogshow = false;
                                    this.dynamicValidateForm.domains = [{ type: "", min: "", max: "", value: '', level: "", levellist: "", unit: "", }];
                                }
                                else if (res.data == 0) {
                                    this.$message({ message: "該項目已存在", type: "error" })
                                }
                                else {
                                    this.$message({ message: "新增失敗", type: "warning" })
                                }
                            })
                            .catch(function () { console.log(error) })
                        console.log(params);
                    }
                }
                else {
                    this.$message({ message: "有項目為空", type: "error" })
                }

            },

            //新增item
            addDomain() {
                var len = this.dynamicValidateForm.domains.length;
                var arr = [];
                arr = this.dynamicValidateForm.domains[len - 1]
                if (arr.level != "" && arr.type != "" && arr.min != "" && arr.max != "") {
                    if (Number(arr.min) > Number(arr.max)) {
                        this.$message({ message: "最小值不能大於最大值", type: "error" })
                    }
                    else {
                        this.dynamicValidateForm.domains.push({
                            value: '',
                            level: "",
                            type: "",
                            min: "",
                            max: "",
                            value: '',
                            levellist: "",
                            unit: "",
                            key: Date.now(),
                            key1: Date.now() + "1",
                            key2: Date.now() + "2",
                            key3: Date.now() + "3",
                            key4: Date.now() + "4"
                        });
                    }
                }
                else {
                    this.$message({ message: "有項目為空", type: "error" })
                }

            },

            //刪除item
            removeDomain(item) {
                var index = this.dynamicValidateForm.domains.indexOf(item)
                if (index !== -1 && this.dynamicValidateForm.domains.length > 1) {
                    this.dynamicValidateForm.domains.splice(index, 1)
                }
            },

            getlevellist(item) {
                var index = this.dynamicValidateForm.domains.indexOf(item)
                if (this.dynamicValidateForm.domains[index].type == "注油等級") {
                    this.dynamicValidateForm.domains[index].levellist = [{ "level": "T" }, { "level": "A" }, { "level": "B" }];
                    this.dynamicValidateForm.domains[index].unit = "mm";
                }
                if (this.dynamicValidateForm.domains[index].type == "熱敏電阻量測等級") {
                    this.dynamicValidateForm.domains[index].levellist = [{ "level": "A" }, { "level": "B" }, { "level": "C" }, { "level": "X" }];
                    this.dynamicValidateForm.domains[index].unit = "ohm";
                }
            },

            //查詢當天新增數量
            get_addcount() {
                var params = {
                    mode: "search_count",
                    datetime: this.d_date
                }
                SearchInfo(params)
                    .then(res => {

                        this.i = ((res.data + 1) < 10 ? "0" + (res.data + 1) : res.data + 1).toString();
                        this.d_no = this.strno + "" + this.i;
                        console.log(this.i);
                    })
                console.log(params);
            },

            //刪除
            handle_delete(row) {
                var params = {
                    mode: "delete_disc",
                    no: row.D_NO,
                    type: row.D_TYPE,
                    level: row.D_LEVEL,
                };
                console.log(params);
                DeleteInfo(params)
                    .then(res => {
                        if (res.data > 0) {
                            this.$message({ message: "刪除成功", type: "success" });
                            this.get_Disc();
                        }
                        else {
                            this.$message({ message: "刪除失敗，請重試", type: "error" })
                        }
                    })
                    .catch(function (error) { console.log(error) })
            },

            //修改
            edit(row) {
                this.dialogedit = true;
                this.e_no = row.D_NO;
                this.e_type = row.D_TYPE;
                this.e_level = row.D_LEVEL;
                this.e_min = row.MIN_NUM;
                this.e_max = row.MAX_NUM;
            },

            //修改
            handle_edit() {
                var params = {
                    mode: "edit_disc",
                    no: this.e_no,
                    type: this.e_type,
                    level: this.e_level,
                    min: this.e_min,
                    max: this.e_max,
                    user: sessionStorage.getItem('userid') == null ? "" : sessionStorage.getItem('userid')
                };
                if (this.e_min != "" && this.e_max != "") {
                    if (Number(this.e_min) > Number(this.e_max)) {
                        this.$message({ message: "最小值不能大於最大值", type: "warning" })
                    }
                    else {
                        UpdateInfo(params)
                            .then(res => {
                                console.log(res.data);
                                if (res.data > 0) {
                                    this.$message({ message: "修改成功", type: "success" })
                                    this.dialogedit = false;
                                    this.get_Disc();
                                }
                                else {
                                    this.$message({ message: "修改失敗", type: "error" })
                                }
                            })
                            .catch(function (error) { console.log(error) })
                    }
                }
                else {
                    this.$message({ message: "有項目為空", type: "warning" })
                }
            },

            //取消模態框
            handle_cancel() {
                this.dialogedit = false;
                this.dialogshow = false;
            },

            //查询
            handle_search() {
                var params = {
                    mode: "search_type",
                    no: this.no,
                    first: this.first,
                    second: this.second,
                };
                this.loading1 = true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1 = false;
                        this.tabledata = res.data.rows;
                        this.total = res.data.total;

                    })
                    .catch(function (error) { console.log(error) })
            },

            handle_refresh() {
                this.get_Disc();
                this.no = "";
                this.first = "";
                this.second = "";
            },
        },
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