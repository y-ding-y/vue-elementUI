<template>
    <div>
        <el-row>
            <el-col>
                <el-card >
                    <div style=" height: 800px;width: 100%;">
                        <iframe id="iframeId" :src="url" frameborder="0" class="pc iframe" scrolling="auto">
                        </iframe>
                    </div> 
                </el-card>
            </el-col>
        </el-row>
    </div>
    


</template>
<style>
    .iframe {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        overflow-y: hidden;
    }
</style>
<script>

    export default {
        components: {}, 
        data() {
            return {
                loading: false,
                 url: 'http://10.35.7.220:7007?user=' + sessionStorage.getItem("userid")
              //  url: 'http://10.196.7.105:7007?user=' + sessionStorage.getItem("userid")
            }
        },
        mounted() {
        },
        created() {
            console.log(sessionStorage.getItem("userid"));
        },
        methods: {

        }

    }
</script>