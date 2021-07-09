<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <!-- <img src="../../assets/img/img.jpg" class="user-avator" alt /> -->
                        <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList" alt>
                        </el-image>
                        &nbsp;&nbsp;&nbsp;
                        <div class="user-info-list" v-bind:style="{display:isvisible}">
                            <div class="user-info-name">工號：{{userid}}</div>
                            <div class="user-info-name">姓名：{{name}}</div>
                            <div class="user-info-name">角色：{{depa}}</div>
                        </div>
                        <div class="user-info-cont" v-bind:style="{display:btnisvisible}">
                            <el-button type="primary" @click="dialogFormVisible=true">
                                登錄
                            </el-button>
                        </div>

                        <div class="user-info-cont" v-bind:style="{display:isvisible}">
                            <el-button type="danger" @click="outlogin()">
                                退出登錄
                            </el-button>
                        </div>
                    </div>

                    <div class="user-info-list">
                        当前时间：{{date}}
                    </div>
                </el-card>
            </el-col>

            </el-col>
        </el-row>

        <el-dialog title="登錄" :visible.sync="dialogFormVisible" v-loading.fullscreen.lock="fullscreenLoading">
            <div style="margin: 0 auto;width: 35%;">
                <el-form label-width="100px" class="demo-ruleForm">
                    <el-form-item label="工號：">
                        <el-input v-model=" id" placeholder="請輸入工號" style="width: 200px;"> </el-input>
                    </el-form-item>
                    <el-form-item label="密碼：">
                        <el-input type="password" placeholder="請輸入密碼" v-model="pwd" style="width: 200px;" @keyup.enter.native="login">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
           

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    Cancel
                </el-button>
                <el-button type="primary" @click="login() ">
                    Confirm
                </el-button>
            </div>
        </el-dialog>



    </div>
</template>

<script>
    import { SearchInfo } from '@/api/index'
    import jpg from '../assets/img/img9.jpg'

    export default {
        data() {
            return {
                date: "",
                url: jpg,
                srcList: [
                    jpg
                ],
                num: "0",
                isvisible: "none",
                btnisvisible: "block",
                dialogFormVisible: false,
                name: "",
                depa: "",
                userid: "",
                id: "",
                pwd: "",
                partnumber: "",
                enable: "Y",
                fullscreenLoading: false,

            };
        },
        mounted: function () {
            let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
            this.timer = setInterval(() => {
                _this.date = this.getTime(); // 修改数据date
            }, 1000)

        },
        created() {
            this.checkuserid();
        },
        activated() {
            this.checkuserid();
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

            outlogin() {//退出登錄
                sessionStorage.clear();
                this.checkuserid();
                this.num = "0";
            },

            checkuserid() { //localStorage判斷用戶是否已登錄過
                var userid = sessionStorage.getItem('userid') == null ? "" : sessionStorage.getItem('userid');
                if (userid != "") {
                    this.btnisvisible = "none";
                    this.isvisible = "block";
                    this.name = sessionStorage.getItem('username') == null ? "" : sessionStorage.getItem('username');
                    this.userid = sessionStorage.getItem('userid') == null ? "" : sessionStorage.getItem('userid');
                    this.depa = sessionStorage.getItem('userdepa') == null ? "" : sessionStorage.getItem('userdepa');
                }
                else {
                    this.btnisvisible = "block";
                    this.isvisible = "none";
                }
            },
            login() {//登錄    
                var params = {
                    mode: "User_Login",
                    userid: this.id,
                    pwd: this.pwd
                };
                this.fullscreenLoading = true;
                SearchInfo(params)
                    .then(res => {
                        this.fullscreenLoading = false;
                        var info = res.data.rows[0];
                        if (res.data.total == 0) {
                            this.$message.error("用戶名或密碼錯誤");
                        }
                        else {
                            console.log("info")
                            console.log(info)
                            this.name = info.userName;
                            this.userid = info.userID;
                            this.depa = info.RoleID;
                            sessionStorage.setItem("userid", info.UserID)
                            sessionStorage.setItem("username", info.UserName)
                            sessionStorage.setItem("userdepa", info.RoleID)
                            this.checkuserid();
                            this.btnisvisible = "none";
                            this.$message.success("登陸成功");
                            this.isvisible = "block";
                            this.dialogFormVisible = false;
                        }
                    })
                    .catch(function (error) { console.log(error) })
            },


        },

    };
</script>


<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

   
</style>