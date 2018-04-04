
import _ from 'lodash';
/**
 * 如果我们在 src 下新建一个文件h.js，再在index.js中引入它，保存，构建之，
 * 我们发现有些没改变的模块的 hash 也发生了改变，这是因为加入h.js后它们的module.id变了，
 * 但这明显是不合理的。在开发环境，我们可以用 NamedModulesPlugin 将 id 换成具体路径名。
 * 而在生产环境，我们可以使用 HashedModuleIdsPlugin。
 */
// import h from './h.js';
// import printMe from './print.js';
// import './style.css'; // 通过`import`引入 CSS 文件
// import Icon from './icon.png'; // Icon 是图片的 URL
// import Data from './data.json'; // Data 变量包含可直接使用的 JSON 解析得到的对象

// function component() {
//   const element = document.createElement('div');
//   const btn = document.createElement('button');

//   element.innerHTML = _.join(['hello', 'webpack'], ' ');
//   element.classList.add('hello'); // 在相应元素上添加类名

//   const myIcon = new Image();
//   myIcon.src = Icon;

//   element.appendChild(myIcon);

//   console.log(Data);

//   btn.innerHTML = 'Click me and check the console!';
//   btn.onclick = printMe;

//   element.appendChild(btn);

//   return element;
// }

// document.body.appendChild(component());
// var element = component();
// document.body.appendChild(element);

// if (module.hot) { // 习惯上我们会检查是否可以访问 `module.hot` 属性
//   module.hot.accept('./print.js', function () { // 接受给定依赖模块的更新，并触发一个回调函数来对这些更新做出响应
//     console.log('Accepting the updated printMe module!');
//     // printMe();

//     /**
//      * 但是当你点击页面的按钮时，你会发现控制台输出的是旧的printMe函数输出的信息，
//      * 因为onclick事件绑定的仍是原始的printMe函数。
//      * 我们需要在module.hot.accept里更新绑定。
//      */
//     document.body.removeChild(element);
//     element = component();
//     document.body.appendChild(element);
//   });
// }

// function component() {
//   return import(/* webpackChunkName: "lodash" */ 'lodash').then(function(_) {
//     const element = document.createElement('div');
//     const btn = document.createElement('button');

//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//     btn.innerHTML = 'Click me and check the console!';
//     btn.onclick = printMe;

//     element.appendChild(btn);

//     return element;
//   }).catch(function(error) {
//     console.log('An error occurred while loading the component');
//   });
// }

// component().then(function(component) {
//   document.body.appendChild(component);
// });

/**
 * 注意上面中的 webpackChunkName: "lodash" 这段注释，
 * 它并不是可有可无的，
 * 它能帮助我们结合output.chunkFilename把分离出的模块最终命名为lodash.bundle.js
 * 而非[id].bundle.js。
 */

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  btn.innerHTML = 'Click me and check the console!';

  element.appendChild(btn);

  btn.onclick = function() {
    import(/* webpackChunkName: "print" */ './print')
      .then(function(module) {
        const printMe = module.default;  // 引入模块的默认函数

        printMe();
      })
  }

  return element;
}

document.body.appendChild(component());