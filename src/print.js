
console.log('The print.js module has loaded! See the network tab in dev tools...');
console.log($('title').text()); // 使用jQuery 不需要const $ = require(“jquery”)


export default function printMe() {
  // console.log('I get called from print.js!');
  // console.log('Updating print.js...');
  console.log('Button Clicked: Here\'s "some text"!');
}
