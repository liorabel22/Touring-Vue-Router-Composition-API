import { createApp, reactive } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const GStore = reactive({ flashMessage: "" });
app.provide("GStore", GStore);

app.use(router);

app.mount("#app");
