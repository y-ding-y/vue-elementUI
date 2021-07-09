<template>
    <div>
        <el-row>
            <el-col>
                <el-card>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="生產計劃量查詢" name="first">
                            <vsearch>

                            </vsearch>
                        </el-tab-pane>
                        <el-tab-pane label="生產計劃量維護" name="second">
                            <vadd>

                            </vadd>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import vsearch from './woplans/search.vue'
    import vadd from './woplans/Add.vue'
    export default {
        data() {
            return {
                activeName: "first",
            }
        },
        components: {
            vadd, vsearch
        },
        methods: {
            handleClick(tab, event) {
                //   console.log(tab, event);
            }
        }
    }
</script>