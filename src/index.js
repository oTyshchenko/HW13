import './style/style.scss';
import COUNTRY_INF from './script/data';
import CSS_COLOR_NAMES from './script/colors';

const LEGEND = document.getElementById("legend");
const CANVAS = document.getElementById("canvas");

const PopulationCounter = (arr) => {
    const initialValue = 0;
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue.population, initialValue);
};

const arrPusher = (arr, el) => {
    arr.push(el);
    return arr;
};

const drawPieSlice = (ctx, centerX, centerY, radius, startAngle, endAngle, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
};

const makePieDiagram = (arr, drawBox, colorArr, legendBox) => {
    const CONTEXT = drawBox.getContext("2d");
    const ARR_POPULATION = (PopulationCounter(arr));

    let counter = 0;
    let startAngle = (Math.PI / 180) * 270;
    
    arr.map((el) => {
        const sliceAngle = 2 * Math.PI * el.population / ARR_POPULATION;

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
        const countryName = document.createElement('span');
        const populationPercent = document.createElement('span');

        li.classList.add('legend-item');
        colorBox.classList.add('color-box');
        colorBox.style.background = colorArr[counter];

        countryName.textContent = el.country;
        populationPercent.textContent = '(' + (100 * el.population / ARR_POPULATION).toFixed(2) + '%)';

        li.appendChild(colorBox);
        li.appendChild(countryName);
        li.appendChild(populationPercent);
        legendBox.appendChild(li);

        counter++;
    });
};

COUNTRY_INF.sort((a, b) => b.population - a.population);

const ONE_PERCENT_EARTH_POPULATION = PopulationCounter(COUNTRY_INF) / 100;

const getBigCounties = COUNTRY_INF.filter(el => el.population > ONE_PERCENT_EARTH_POPULATION);
const getOtherCountries = COUNTRY_INF.filter(el => el.population < ONE_PERCENT_EARTH_POPULATION);

const OTHERS_CONTRY = {ID: 'OTH', country: 'Others', population: PopulationCounter(getOtherCountries)};

const RESULT_DATA = arrPusher(getBigCounties, OTHERS_CONTRY);

makePieDiagram (RESULT_DATA, CANVAS, CSS_COLOR_NAMES, LEGEND);