<template>
    <div>
        <el-row>
            <el-card>
                <el-form inline label-width="80px">
                    <el-form-item label="FGSN">
                        <el-input v-model="sn" style="width: 200px;"></el-input>
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
                        <el-button type="success" icon="el-icon-download" @click="handle_down">Down Excel</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="tabledata.slice((currentPage-1)*pagesize,currentPage*pagesize)" border class="tabletrace" v-loading="loading1">
                    <el-table-column label="DISC版本" prop="disc_rev"></el-table-column>
                    <el-table-column label="Factory SN" prop="fcsn"></el-table-column>
                    <el-table-column label="DISC" prop="fgsn"></el-table-column>
                    <el-table-column label="矽油寬度" prop="oilwidth"></el-table-column>
                    <el-table-column label="矽油量等級" prop="oillevel"></el-table-column>
                    <el-table-column label="Buffer液量" prop="bufferlength"></el-table-column>
                    <el-table-column label="矽油量" prop="oillength"></el-table-column>
                    <el-table-column label="热敏电阻" align="center">
                        <el-table-column label="A區" prop="cnt_a"></el-table-column>
                        <el-table-column label="C區" prop="cnt_c"></el-table-column>
                    </el-table-column>
                    <el-table-column label="熱敏電阻CNT量測" prop="cnt_level"></el-table-column>
                </el-table>

                <div style="text-align: center;margin-top: 30px;"  v-if="pageshow">
                    <el-pagination @size-change="handleSizeChange" @current-change="current_change"
                        :page-sizes="[10, 20, 30, 50]" :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>

            </el-card>
        </el-row>
    </div>
</template>

<script>
    import { SearchInfo } from '@/api/index.js'
    export default {
        name:"discsearch",
        data() {
            return {
                tabledata: [],
                first: "",
                second: "",
                sn: "",
                total: 0,
                pagesize: 10,
                currentPage: 1,
                loading1:false,
                pageshow:false,
            }
        },
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
            handle_cancel() {
                this.dialogshow = false;
            },
            getIndex($index) {  //表格序号 
                return ((this.currentPage - 1) * this.pagesize + $index + 1)
            },

            handle_search() {
                var params = {
                    mode: "DISC_Search",
                    sn: this.sn,
                    first: this.first,
                    second: this.second
                }
                if (this.second != "" && this.first != "" && this.second < this.first) {
                    this.$message({ message: "結束日期不能小於起始日期", type: "warning", closeShow: true });
                }
                else{
                    this.loading1=true;
                SearchInfo(params)
                    .then(res => {
                        this.loading1=false;
                        var model = res.data;
                        this.tabledata = model.Table;
                        this.total = model.Table.length;
                        this.currentPage = 1;
                            this.current_change(1);
                            this.pageshow = false;
                            this.$nextTick(() => {//重新渲染分页
                                this.pageshow = true;
                            });
                    })
                    .catch(error => { console.log(error) })
                } 
            },

            handle_refresh() {
                this.sn = "";
                this.first = "";
                this.second = "";
                this.tabledata.length=0;
            },

            handle_down() { 
                if (this.second != "" && this.first != "" && this.second < this.first) {
                    this.$message({ message: "結束日期不能小於起始日期", type: "warning", closeShow: true });
                }
                else{
                    var date = new Date(); //实例化一个时间对象
                    var year = date.getFullYear(); //获取年
                    var month = date.getMonth() + 1; //获取月份，因为是0-11.所以要加上1
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    var strpath = year + "-" + month + "-" + day + "-" + " " + hour + ":" + minute + ":" + second;//excel文件名
                    // DownLoad(params)
                    //     .then(res => {
                    //         location.href = location.origin + "/" + res;
                    //     })
                    //     .catch(function (error) { console.log(error) })

                    let elink = document.createElement('a');
                    elink.href = "api/DownManage?mode=down_disc&sn=" + this.sn + "&first=" + this.first + "&second=" + this.second ;
                    elink.download = strpath + ".xls";
                    elink.click();
                }
                
             },


        }
    }
</script>

<style>
      .tabletrace td {
        border: 1px solid rgb(77, 77, 77);
    }

    /* .tabletrace tr {
        
    } */

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

</style>