const prefixName = 'link_livu_';

// 获取、 设置、删除 local
function getLocal(name) {
    if (!name) return;
    return window.localStorage.getItem(prefixName + name);
}
function setLocal(name, content) {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(prefixName + name, content);
}
function removeLocal(name) {
    if (!name) return;
    window.localStorage.removeItem(prefixName + name);
}

export { getLocal, setLocal, removeLocal };
