import Vue from 'vue'
import App from './App.vue'
import GeneralInformationView from './components/GeneralInformationView'
import RegionView from './components/RegionView'
import VueRouter from 'vue-router';

Vue.config.productionTip = false;
Vue.use(VueRouter);
const routes = [
    {path: '/general', component: GeneralInformationView},
    {path: '/region', component: RegionView}
];
const router = new VueRouter({routes});
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
