import { createApp } from "vue";
import App from "./App.vue";
import './assets/global.css'

const app = createApp(App)
app.config.errorHandler = (err, vm, info) => {
    console.log(
        'CUSTOM ERROR',
        err,
        vm,
        info
    )
}
app.config.performance = true
app.mount("#app");
