// /index.html?width=10&height=5&seed=9

var height = getURLParameter("height") || 50;
var width = getURLParameter("width") || 100;

var maze = document.getElementById('maze');
var canvas = document.createElement('canvas');
canvas.setAttribute('width', width * 4);
canvas.setAttribute('height', height * 6);
document.body.appendChild(canvas);

var ctx    = canvas.getContext('2d');

var styleHtml = '';
var styleTags = document.getElementsByTagName('style');
for (var i = 0; i < styleTags.length; i++) {
  styleHtml += styleTags[i].outerHTML;
}

styleHtml = styleHtml
  .replace(new RegExp('vw', 'g'), 'px')
  .replace(new RegExp('width:.+8px;', 'g'), 'width: 4px;')
  .replace(new RegExp('height:.+10px;', 'g'), 'height: 4px;')
  .replace(new RegExp('#CCC', 'g'), '#000')
  .replace(new RegExp('#DDD;', 'g'), '#FFF')
  .replace(new RegExp('background-color:.+;', 'g'), '');
console.log(styleHtml);

var data = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">
        ${styleHtml + maze.outerHTML}
      </div>
    </foreignObject>
  </svg>`;

var DOMURL = window.URL || window.webkitURL || window;

var img = new Image();
var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
var url = DOMURL.createObjectURL(svg);

img.onload = function () {
  setTimeout(function() {
    ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);
    getGridFromImage(ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight));
  }, 0);
}

img.setAttribute('crossOrigin', '');
img.src = url;

function getGridFromImage(imageData) {
  var grid = new Array(imageData.height);
  for (let y = 0; y < imageData.height; y++) {
    grid[y] = new Array(imageData.width);
  }

  for (var i = 0, length = imageData.data.length; i < length; i += 4) {
    var x = Math.floor(i/4 % imageData.width);
    var y = Math.floor(i/4 / imageData.width);
    grid[y][x] = imageData.data[i] === 0;
  }

  console.log(grid);
  return grid;
}
