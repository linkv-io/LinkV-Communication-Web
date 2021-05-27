import Vue from 'vue'
import { Table, TableColumn, Input, Button, Dialog, Popconfirm, Popover } from 'element-ui'
let arr = [Table, TableColumn, Input, Button, Dialog, Popconfirm, Popover]
arr.forEach(item => {
    Vue.use(item)
})

