<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <el-card>
                    <el-form label-width="80px" inline>
                        <el-form-item label="FGSN">
                            <el-input v-model="sn"></el-input>
                        </el-form-item>
                        <el-form-item label="選擇日期">
                            <el-date-picker v-model="first" type="datetime" placeholder="起始時間"
                                value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>--
                            <el-date-picker v-model="second" type="datetime" placeholder="結束時間"
                                value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button icon="el-icon-search" @click="handle_search" type="primary">Search</el-button>
                            <el-button icon="el-icon-refresh" @click="handle_refresh" type="primary">Reset</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="tabledata.slice((currentpage-1)*pagesize,currentpage*pagesize)" border
                        v-loading="loading" row-key="id" @expand-change="handle_expand" ref="classTable" class="table1">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table border :data="props.row.dicts" class="table2" :key="props.row.id"
                                    v-loading="loading2">
                                    <el-table-column v-for="item in props.row.discname" :label="item.ParameterName"
                                        :property="item.prop" :key="item.itemno" align="center">
                                        <template slot-scope="scope">
                                            <span>
                                                {{scope.row[scope.column.property]}} </span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column label="序號" align="center" width="100px">
                            <template slot-scope="scope">
                                <span v-text="getIndex(scope.$index)"> </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="SN" prop="sn"></el-table-column>
                        <el-table-column label="工令號" prop="workerid"></el-table-column>
                        <el-table-column label="工站" prop="stationname"></el-table-column>
                        <el-table-column label="出货SN" prop="disksn"></el-table-column>
                        <el-table-column label="ST05时间" prop="begintime"></el-table-column>
                        <el-table-column label="日期" prop="begindate"></el-table-column>
                    </el-table>

                    <div style="text-align: center;margin-top:30px;">
                        <el-pagination @size-change="handlesizechange" @current-change="current_change"
                            :page-sizes="[10,20,30,50]" :page-size="pagesize"
                            layout="total,sizes,prev,pager,next,jumper" :total="total">
                        </el-pagination>
                    </div>

                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import { SearchInfo } from '@/api/index.js'
    export default {
       
        data() {
            return {
                tabledata: [],
                sn: "",
                first: "",
                second: "",

                pagesize: 10,
                total: 0,
                currentpage: 1,
                loading: false,
                loading2: false,
            }
        },
        methods: {
            //查询
            handle_search() {
                if (this.first > this.second) {
                    this.$message({ message: "起始日期不能大于结束日期", type: "warning" });
                }
                else {
                    this.loading = true;
                    var params = {
                        mode: "searchdisc",
                        sn: this.sn,
                        first: this.first,
                        second: this.second
                    }
                    console.log(params);
                    SearchInfo(params)
                        .then(res => {
                            this.loading = false;
                            console.log(res.data);
                            for (var i = 0; i < res.data.total; i++) {
                                res.data.rows[i].id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                                res.data.rows[i].dicts = [];
                                res.data.rows[i].discname = [];
                            }
                            this.tabledata = res.data.rows;
                            this.total = res.data.total;
                        })
                        .catch(function (error) { console.log(error) })
                }
            },

            //展開子表
            handle_expand(row, expandedRows) {
                this.tableColumnList = [];
                row.dicts.length = 0
                if (expandedRows.length > 0) {
                    this.get_compopnrnt(row);
                    const $classTable = this.$refs.classTable
                    this.handle_searchexpand(row, expandedRows);
                }
            },

            handle_searchexpand(row, expandedRows) {
                if (row.dicts.length == 0) { //这里做了一个判断，首先判断这一行的数据对象有没有dicts这个属性，如果没说明没有数据我们需要请求后台，相当于懒加载 
                    var params = {
                        mode: "searchdate",
                        sn: row.sn,
                        stationid: row.stationid
                    };
                    console.log(params);
                    this.loading2 = true;
                    let self = this
                    SearchInfo(params)
                        .then(rspData => { //这里是我们项目里封装的ajax请求方法，相当于axios.post() 
                            this.loading2 = false;
                            console.log(rspData.data);
                            const index = self.tabledata.findIndex(data => data.id === row.id) //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
                            if (rspData.data && rspData.data.length) {
                                rspData.data.forEach(item => { //这里我是给每个子分组信息里都加上父分组的id，以方便后面操作子表格每一行后，回调函数里刷新数据时需要用到，要知道他的父亲是谁，哈哈
                                    item.labelId = row.id
                                })
                            }
                            self.$set(self.tabledata[index], 'dicts', rspData.data.rows) //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
                        }) //关键就是这个方法，row.id是父分组的id需要传给后台查询该子分组的信息 
                }
            },

            //获取子表的表名
            get_compopnrnt(row) {
                if (row.discname.length == 0) { //这里做了一个判断，首先判断这一行的数据对象有没有dicts这个属性，如果没说明没有数据我们需要请求后台，相当于懒加载 
                    var params = {
                        mode: "searchcolumn",
                        stationid: row.stationid,
                    };
                    console.log(params);
                    this.loading2 = true;
                    let self = this
                    SearchInfo(params)
                        .then(rspData => { //这里是我们项目里封装的ajax请求方法，相当于axios.post() 
                            this.loading2 = false;
                            console.log(rspData.data);
                            for (var i = 0; i < rspData.data.total; i++) {
                                rspData.data.rows[i].prop = "MParameter" + (i + 1)
                            }
                            const index = self.tabledata.findIndex(data => data.id === row.id) //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
                            if (rspData.data && rspData.data.length) {
                                rspData.data.forEach(item => { //这里我是给每个子分组信息里都加上父分组的id，以方便后面操作子表格每一行后，回调函数里刷新数据时需要用到，要知道他的父亲是谁，哈哈
                                    item.labelId = row.id
                                })
                            }
                            self.$set(self.tabledata[index], 'discname', rspData.data.rows) //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
                        }) //关键就是这个方法，row.id是父分组的id需要传给后台查询该子分组的信息 
                }
            },

            //刷新
            handle_refresh() {
                this.first = "";
                this.second = "";
                this.sn = "";
                this.tabledata = [];
            },

            handlesizechange(val) {
                this.pagesize = val;
            },

            //翻页
            current_change(val) {
                this.currentpage = val;
            },

            //表格序号  
            getIndex($index) {
                return ((this.currentpage - 1) * this.pagesize + $index + 1)
            },
        }
    }
</script>

<style >

/* .table1 thead th
{
    border-top: 1px solid rgb(0, 0, 0);
        border-left: 1px solid  rgb(0, 0, 0);
}

    .table1 td {
        border-top: 1px solid;
        border-right: 1px solid  ;
    }*/

    .table2 th {
        background-color: rgb(189, 225, 255);
        color: rgb(0, 0, 0);
    } 
</style>