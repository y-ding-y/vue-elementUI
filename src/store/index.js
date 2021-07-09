import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {  
        lineid: [], 
        lot:"",
        lot2:"",
        trace_lot:"",
        trace_component:"",
        params:{},
    },

    getters: {
         
        getlineid: function (state) {
            return state.lineid
        }, 
        getlot:function(state)
        {
            return state.lot
        },
        getlot2:function(state)
        {
            return state.lot2
        },
        gettracelot:function(state)
        {
            return state.trace_lot
        },
        gettracecomponent:function(state)
        {
            return state.trace_component
        },
        getsip:function(state){
            return state.params
        }
    },
    mutations: { 
        setlineid(state, newval) {
            state.lineid = newval;
        }, 
        setlot(state,newval)
        {
            state.lot=newval;
        },
        setlot2(state,newval)
        {
            state.lot2=newval;
        },
        settracelot(state,newval)
        {
            state.trace_lot=newval;
        },
        settracecomponent(state,newval)
        {
            state.trace_component=newval;
        },
        setsip(state,newval)
        {
            state.params=newval;
        }
    },
    actions: { 
        setlineid(context, newval) {
            context.commit("setlineid", newval)
        }, 
        setlot(context,newval)
        {
            context.commit("setlot",newval);
        },
        setlot2(context,newval)
        {
            context.commit("setlot2",newval);
        },
        settracelot(context,newval)
        {
            context.commit("settracelot",newval);
        },
        settracecomponent(context,newval)
        {
            context.commit("settracecomponent",newval);
        },
        setsip(context,newval)
        {
            context.commit("setsip",newval)
        }

    }
});

export default store;