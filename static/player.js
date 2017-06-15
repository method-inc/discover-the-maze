const API_URL = '/api/maze';

const height = getURLParameter("height") || 50;
const width = getURLParameter("width") || 100;
const cellPixels = 3;
const rasterizeOptions = { height: height * cellPixels, width: width * cellPixels };

const mazeElement = document.getElementById('maze');
const canvas = document.createElement('canvas');
canvas.setAttribute('height', rasterizeOptions.height);
canvas.setAttribute('width', rasterizeOptions.width);
const ctx = canvas.getContext('2d');
const styleHtml = replaceStyleValues();

function replaceStyleValues() {
  function replaceStyleValue(str, prop, val) {
    return str.replace(new RegExp(`${prop}:\\s*\\d+(\\.\\d+)?vw`, 'g'), `${prop}: ${val}`)
  }

  let intermediateStyles = `<style>
  body {
    padding: 0;
    margin: 0;
  }
  #maze {
    background-color: #FFFFFF;
  }
  .node {
    background-color: #FFFFFF;
    display: table-cell;
  }
  </style>`;
  const styleTags = document.getElementsByTagName('style');

  for (let i = 0; i < styleTags.length; i++) {
    intermediateStyles += styleTags[i].outerHTML;
  }

  const updatedStyleValues = {
    'border': '1px',
    'border-top': '1px',
    'border-right': '1px',
    'border-bottom': '1px',
    'border-left': '1px',
    'background-color': '#FFFFFF',
    'width': `${(cellPixels - 2)}px`,
    'height': `${(cellPixels - 2)}px`,
  };

  Object.entries(updatedStyleValues).forEach(([prop, val]) => {
    intermediateStyles = replaceStyleValue(intermediateStyles, prop, val);
  });

  return intermediateStyles
    .replace(new RegExp('#CCC', 'g'), '#000')
    .replace(new RegExp('#DDD;', 'g'), '#FFF')
}

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
