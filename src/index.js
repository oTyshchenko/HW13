import './style/style.scss';
import COUNTRY_INF from './script/data';
import CSS_COLOR_NAMES from './script/colors';

const WRAPPER = document.getElementById('wrapper');
const CANVAS = document.getElementById("canvas");
const onePercent = 1;

const earthPopulation = COUNTRY_INF.reduce((acc, currentValue) => acc + currentValue.population, 0);

const currentData = COUNTRY_INF.map(el => 
    ({country: el.country, percentPopulation: el.population / earthPopulation * 100}));

const bigCounties = currentData.filter(el => el.percentPopulation > onePercent)
    .sort((a, b) => b.percentPopulation - a.percentPopulation);

const otherCountry  = {
    country: 'Others',
    percentPopulation: currentData.reduce((acc, el) => {
        if (el.percentPopulation < onePercent) {
            return acc + el.percentPopulation;
        } else {
            return acc + 0;
        }
    }, 0)
};

const resultData = [...bigCounties, otherCountry];

const drawPieSlice = (ctx, centerX, centerY, radius, startAngle, endAngle, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
};

const makePieDiagram = (arr, drawBox, colorArr) => {
    const legend = document.createElement('ul');
    const context = drawBox.getContext("2d");
    let counter = 0;
    let startAngle = (Math.PI / 180) * 270;

    legend.classList.add('legend');
    
    arr.forEach((el) => {
        const sliceAngle = 2 * Math.PI * el.percentPopulation / 100;

        drawPieSlice(
            context,
            drawBox.width/2,
            drawBox.height/2,
            Math.min(drawBox.width/2, drawBox.height/2),
            startAngle,
            startAngle + sliceAngle,
            colorArr[counter]);

        startAngle += sliceAngle;

        const li = document.createElement('li');
        const colorBox = document.createElement('div');
        const countryDescription = document.createElement('span');

        li.classList.add('legend-item');
        colorBox.classList.add('color-box');
        colorBox.style.background = colorArr[counter];

        countryDescription.textContent = `${el.country} (${(el.percentPopulation).toFixed(2)}%)`;

        li.appendChild(colorBox);
        li.appendChild(countryDescription);
        legend.appendChild(li);

        counter++;
    });
    WRAPPER.appendChild(legend);
};

makePieDiagram (resultData, CANVAS, CSS_COLOR_NAMES);