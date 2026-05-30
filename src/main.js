import {createApp} from 'vue';

import App from './App.vue';
import router from './router/index.js';
import {createPinia} from 'pinia';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import global styles
import './assets/base.css';
// Create the Pinia instance
const pinia = createPinia();
import PrimeVue from 'primevue/config';

// Create the Vue app instance
const app = createApp(App);
// Use the router and pinia instances
app.use(pinia);

app.use(router);
app.use(PrimeVue);

// Mount the application
app.mount('#app');