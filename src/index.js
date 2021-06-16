import './index.css';
// import print from './print';
// import '@babel/polyfill';

console.log('index.js was loadedffd');
print();
function addComponent() {
  const element = document.createElement('div');
  element.innerHTML = 'Hello , webpack';
  element.classList.add('hello');
  return element;
}

document.body.appendChild(addComponent());

if (module.hot) {
  module.hot.accept('./print.js', () => {
    // 方法会监听print的文件变化，一旦发生变化，其他模块不会重新打包构建
    // 会执行后面的回调函数
    print();
  });
}
new Promise((resolve,reject)=>{
  let oPromise;
  resolve(console.log("resolve promise"))
});
