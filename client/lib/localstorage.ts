// 创建一个自定义事件，用于通知变化
const storageChangeEvent = new Event('customStorageChange');

// 保存原始的 localStorage 方法
const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;
const originalClear = localStorage.clear;
/**
 * 重写 localStorage 的原型方法，并在操作后派发自定义事件。
 * 这样，所有调用 localStorage.setItem/removeItem/clear 的地方都会触发这个事件。
 */
function initStorageListener() {
  localStorage.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    window.dispatchEvent(storageChangeEvent);
    console.log(`[Storage Listener] setItem: ${key}`);
  };

  localStorage.removeItem = function(key) {
    originalRemoveItem.call(this, key);
    window.dispatchEvent(storageChangeEvent);
    console.log(`[Storage Listener] removeItem: ${key}`);
  };

  localStorage.clear = function() {
    originalClear.call(this);
    window.dispatchEvent(storageChangeEvent);
    console.log(`[Storage Listener] clear`);
  };
}

export { initStorageListener, storageChangeEvent };