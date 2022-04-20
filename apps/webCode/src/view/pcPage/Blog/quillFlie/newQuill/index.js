/* 引用组件入口页面 */
import qsEditor from './src/views/index.vue'
/* 供Vue.use()全局注册使用的方法 */
const install = function(Vue, opts = {}) {
    Vue.component(qsEditor.name, qsEditor);
};
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
/* 
    install供全局注册组件使用
*/
export default install
