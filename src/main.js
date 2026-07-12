import {createApp} from 'vue';

import App from './App.vue';
import router from './router/index.js';
import {createPinia} from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import global styles
import './assets/base.css';
import PrimeVue from 'primevue/config';
// Create the Pinia instance
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// Create the Vue app instance
const app = createApp(App);
// Use the router and pinia instances
app.use(pinia);
app.use(router);
app.use(PrimeVue);

// Mount the application
app.mount('#app');