const API_URL = 'http://0.0.0.0:5000/api/maze';

const height = getURLParameter("height") || 50;
const width = getURLParameter("width") || 100;
const cellPixels = 3;
const rasterizeOptions = { height: height * cellPixels, width: width * cellPixels };

const mazeElement = document.getElementById('maze');
const canvas = document.createElement('canvas');
canvas.setAttribute('height', rasterizeOptions.height);
canvas.setAttribute('width', rasterizeOptions.width);
const ctx = canvas.getContext('2d');

let styleHtml = '';
const styleTags = document.getElementsByTagName('style');
for (let i = 0; i < styleTags.length; i++) {
  styleHtml += styleTags[i].outerHTML;
}

styleHtml = styleHtml
  .replace(new RegExp('border:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border: 1px')
  .replace(new RegExp('border-top:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border-top: 1px')
  .replace(new RegExp('border-right:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border-right: 1px')
  .replace(new RegExp('border-bottom:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border-bottom: 1px')
  .replace(new RegExp('border-left:\\s*\\d+(\\.\\d+)?vw', 'g'), 'border-left: 1px')
  .replace(new RegExp('width:\\s*\\d+(\\.\\d+)?vw', 'g'), 'width: ' + (cellPixels - 2) + 'px')
  .replace(new RegExp('height:\\s*\\d+(\\.\\d+)?vw', 'g'), 'height: ' + (cellPixels - 2) + 'px')
  .replace(new RegExp('#CCC', 'g'), '#000')
  .replace(new RegExp('#DDD;', 'g'), '#FFF')
  .replace(new RegExp('background-color:.+;', 'g'), 'background-color: #FFFFFF;');

function dataURItoBlob(dataURI) {
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for(let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: 'image/png'});
}

function executeSolution(solution) {
  for (let i=0; i < solution.length; i++) {
    const move = solution[i];
    const currentIndex = maze.currentIdx();
    const newIndex = maze[move]();
    if (currentIndex === newIndex) {
      console.error('we screwed up');
      maze.stop(true);
      return false;
    }
  }
  maze.stop(true);
}

function solve() {
  rasterizeHTML.drawHTML(styleHtml + mazeElement.outerHTML, canvas, rasterizeOptions).then(function (renderResult) {
    const dataUrl = canvas.toDataURL('image/png');
    const pixels = ctx.getImageData(0, 0, width * 6, height * 6);
    const blob = dataURItoBlob(dataUrl);
    const form = new FormData();

    form.append('file', blob, 'maze' + new Date().getTime() + '.png');
    fetch(API_URL, {
      method: 'post',
      body: form,
    }).then(response => {
      if (response.ok) {
        response.json().then(({ solveable, moves }) => {
          if (solveable) {
            executeSolution(moves);
          } else {
            console.log('not solveable');
            maze.stop(false);
          }
        });
      }
    });
  });
}

// Load rasterize dependency asynchronously
(function(d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = solve;
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/rasterizehtml/1.2.4/rasterizeHTML.allinone.js';
    d.head.appendChild(script);

    style = d.createElement('style');
    style.innerHTML = `
      body {
        padding: 50px;
      }
      .current {
        position: relative;
        background-color: inherit;
      }
      .current:after {
        width: 200%;
        height: 200%;
        position: absolute;
        top: -50%;
        left: -50%;
        background-image: url(https://emoji.slack-edge.com/T024FHH0A/glenn_face/aebca6a2b4fe85bc.png);
        background-size: cover;
        content: '';
        animation: panting infinite 0.8s linear;
      }

      @keyframes panting {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        0% { transform: scale(1); }
      }
    `;
    d.head.appendChild(style);
}(document));
