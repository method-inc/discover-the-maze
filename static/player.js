// /index.html?width=10&height=5&seed=9

var apiUrl = '/api';
var height = getURLParameter("height") || 50;
var width = getURLParameter("width") || 100;

var maze = document.getElementById('maze');
var canvas = document.createElement('canvas');
canvas.setAttribute('width', width * 6);
canvas.setAttribute('height', height * 6);
document.body.appendChild(canvas);

var ctx    = canvas.getContext('2d');

var styleHtml = '';
var styleTags = document.getElementsByTagName('style');
for (var i = 0; i < styleTags.length; i++) {
  styleHtml += styleTags[i].outerHTML;
}

styleHtml = styleHtml
  .replace(new RegExp('border:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border: 1px')
  .replace(new RegExp('border-top:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border-top: 1px')
  .replace(new RegExp('border-right:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border-right: 1px')
  .replace(new RegExp('border-bottom:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border-bottom: 1px')
  .replace(new RegExp('border-left:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border-left: 1px')
  .replace(new RegExp('width:\\s*\\d+(\\.\\d+)?vw', 'g'), 'width: 4px')
  .replace(new RegExp('height:\\s*\\d+(\\.\\d+)?vw', 'g'), 'height: 4px')
  .replace(new RegExp('#CCC', 'g'), '#000')
  .replace(new RegExp('#DDD;', 'g'), '#FFF')
  .replace(new RegExp('background-color:.+;', 'g'), '');

console.log(styleHtml);

// var data = `
//   <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
//     <foreignObject width="100%" height="100%">
//       <div xmlns="http://www.w3.org/1999/xhtml">
//         ${styleHtml + maze.outerHTML}
//       </div>
//     </foreignObject>
//   </svg>`;


rasterizeHTML.drawHTML(styleHtml + maze.outerHTML).then(function (renderResult) {
    ctx.drawImage(renderResult.image, 0, 0);
    var dataUrl = canvas.toDataURL('image/png');
    var pixels = ctx.getImageData(0, 0, width * 6, height * 6);
    var blob = dataURItoBlob(dataUrl);
    var form = new FormData();
    form.append('file', blob, 'maze' + new Date().getTime() + '.png');
    $.ajax({
      method: 'POST',
      url: apiUrl + '/maze',
      data: form,
      contentType: false,
      processData: false,
      success: function(res) {
        console.log('success');
      },
      error: function(res) {
        console.log('error');
        console.log(res);
      }
    });
});
var DOMURL = window.URL || window.webkitURL || window;
//
// var img = new Image();
// img.crossOrigin = 'anonymous';
// document.body.appendChild(img);
// var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
// var url = DOMURL.createObjectURL(svg);
//
function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for(var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: 'image/png'});
}
//
// img.onload = function () {
//   var dataUrl = canvas.toDataURL('image/png');
//   var blob = dataURItoBlob(dataUrl);
//   var form = new FormData();
//   form.append('file', blob, 'maze' + new Date().getTime() + '.png');
//   $.ajax({
//     method: 'POST',
//     url: apiUrl + '/maze',
//     data: form,
//     contentType: false,
//     processData: false,
//     success: function(res) {
//       console.log('success');
//     },
//     error: function(res) {
//       console.log('error');
//       console.log(res);
//     }
//   });
// }
//
// img.src = url;

// function getGridFromImage(imageData) {
//   var grid = new Array(imageData.height);
//   for (let y = 0; y < imageData.height; y++) {
//     grid[y] = new Array(imageData.width);
//   }
//
//   for (var i = 0, length = imageData.data.length; i < length; i += 4) {
//     var x = Math.floor(i/4 % imageData.width);
//     var y = Math.floor(i/4 / imageData.width);
//     grid[y][x] = imageData.data[i] === 0;
//   }
//
//   console.log(grid);
//   return grid;
// }
