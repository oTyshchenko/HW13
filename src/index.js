import './style/style.scss';
import COUNTRY_INF from './script/data';
import CSS_COLOR_NAMES from './script/colors';

const WRAPPER = document.getElementById('wrapper');
const CANVAS = document.getElementById("canvas");
const onePercent = 1;

const earthPopulation = COUNTRY_INF.reduce((acc, currentValue) => acc + currentValue.population, 0);

let currentData = COUNTRY_INF.map((el) => {
    return {
        ...el,
        percentPopulation: el.population / earthPopulation * 100
    }
});

const BigCounties = currentData.filter(el => el.percentPopulation > onePercent);
const OtherCountries = currentData.filter(el => el.percentPopulation < onePercent);

BigCounties.sort((a, b) => b.population - a.population);

const otherCountry  = {
    country: 'Others',
    percentPopulation: OtherCountries.reduce((acc, currentValue) => acc + currentValue.percentPopulation, 0)
};

const resultData = BigCounties.map((el) => {
    return {...el,}
});

resultData.push(otherCountry);

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
    legend.classList.add('legend');
    const CONTEXT = drawBox.getContext("2d");

    let counter = 0;
    let startAngle = (Math.PI / 180) * 270;
    
    arr.forEach((el) => {
        const sliceAngle = 2 * Math.PI * el.percentPopulation / 100;

        drawPieSlice(
            CONTEXT,
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