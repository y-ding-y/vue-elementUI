<template>
    <div>
       
    </div>
</template>

<script>
    import { GetInfo, SearchInfo } from './../api/index.js'
    export default {
        data() {
            return {
               
            }
        },
        methods: {
            //修改当前显示条数
            handlesizechange(val) {
                this.pagesize = val;
            },

            //翻页
            current_change(val) {
                this.currentpage = val;
            },

            getIndex($index) {  //表格序号 
                console.log((this.currentPage));
                return ((this.currentpage - 1) * this.pagesize + $index + 1)
            },

            handle_search() {
                var params = {
                    mode: "Search_IQCTime",
                    first: this.first,
                    second: this.second,
                }
                if (this.first == "" || this.second == "") {
                    this.$message.warning("请选择日期")
                }
                else if (this.second < this.first) {
                    this.$message.warning("结束日期不能小于起始日期");
                }
                else {
                    this.loading = true;
                    SearchInfo(params)
                        .then(res => {
                            this.loading = false;
                            this.tabledata = res.data.rows;
                            this.total = res.data.total;
                        })
                        .catch(function (error) { console.log(error) })
                }

            },

            handle_param(element){
                console.log(element);
            },

            handle_refresh() {
                this.first = "";
                this.second = "";
                this.tabledata = [];
            }
      
        }
    }
</script>