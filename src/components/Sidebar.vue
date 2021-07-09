<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse"  router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from './bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    // {
                    //     icon: 'el-icon-lx-text',
                    //     index: 'charts',
                    //     title: '首頁'
                    // },

                    // {
                    //     icon:"el-icon-lx-text",
                    //     index:"1",
                    //     title:"SFC_Route",
                    // },
                    {
                        icon: "el-icon-office-building",
                        index: "dashboard",
                        title: "首页",

                    },

                    {
                        icon: "el-icon-apple",
                        index: "search",
                        title: "資料查询",
                        subs: [
                            {
                                icon: "el-icon-refrigerator",
                                index: "iqc_search",
                                title: "IQC查询",
                            },
                            {
                                icon: "el-icon-orange",
                                index: "sip_search",
                                title: "SIP查询",
                            },
                            {
                                icon: "el-icon-cherry",
                                index: "discsearch",
                                title: "DISC出货检验记录"
                            },
                            {
                                icon: "el-icon-pear",
                                index: "errorsearch",
                                title: "不良查询"
                            },
                            {
                                icon: "el-icon-water-cup",
                                index: "process",
                                title: "過站信息查詢"
                            },
                            {
                                icon: "el-icon-apple",
                                index: "trace",
                                title: "產品追溯"
                            },
                            {
                                icon: "el-icon-food",
                                index: "allview",
                                title: "生產達成率看板"
                            },
                        ]
                    },
                    {
                        icon: "el-icon-watermelon",
                        index: "add",
                        title: "資料維護",
                        subs: [
                            {
                                index: "addcomponent",
                                title: "研發規格值管理"
                            },
                            {
                                index: "oqcform",
                                title: "OQC維護"
                            },
                            {
                                index: "ipqc",
                                title: "IPQC维护"
                            },
                            {
                                index: "excelupload",
                                title: "Excel上傳"
                            },
                            {
                                index: "uploadfile",
                                title: "IQC附件上傳"
                            },
                            {
                                index: "vendor",
                                title: "供应商维护"
                            },
                            {
                                index: "component",
                                title: "物料维护"
                            },
                            {
                                index: "wo",
                                title: "企劃-工令維護"
                            },
                            {
                                index: "plans",
                                title: "生产计划量维护"
                            }
                        ]
                    },


                    // {
                    //     icon: "el-icon-refrigerator",
                    //     index: "infomanage",
                    //     title: "資料維護",
                    //     subs: [
                    //         {
                    //             index: "uploadexcel",
                    //             title: "上傳excel(vue version)"
                    //         },



                    //     ]
                    // },


                ]
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar>ul {
        height: 100%;
    }
</style>