import Vue from "vue"; 
import ToastVue from "./index.vue"; 

let ToastConstructor = Vue.extend(ToastVue);

const Toast = function(options = {}) {
    let instance = new ToastConstructor({
        data: options
    }).$mount();
    document.getElementById('app').appendChild(instance.$el);
};

export default Toast;
