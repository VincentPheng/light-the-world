const INVIS_CHAR = "&nbsp";
const DOLLAR_CHAR = "$";
const MONEY_STR = "Money: $";
const DAY_STR = "Day ";

const LPS_STR = {
    plain: "Plain Lighters Per Second: ",
    colored: "Colored Lighters Per Second: ",
    zippo: "Zippo Lighters Per Second: ",
    candle: "Candle Lighters Per Second: ",
    butane: "Butane Lighters Per Second: ",
    plasma: "Plasma Lighters Per Second: ",
    spell: "Spells Written Per Second: "
}

const COUNT_STR = {
    plain: "Plain Lighters: ",
    colored: "Colored Lighters: ",
    zippo: "Zippo Lighters: ",
    candle: "Candle Lighters: ",
    butane: "Butane Lighters: ",
    plasma: "Plasma Lighters: ",
    spell: "Spells: "
}

const lighterArray = ["plain", "colored", "zippo", "candle", "butane", "plasma", "spell"]
const startingLPS = [0.05, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
const startingPrice = [0.5, 2.5, 5.0, 50.0, 250.0, 1000.0, 500000.0];


const MARKET_VARIANCE = 0.05425234;

var money = 4.5; //starting money
var day = 1;

var lighterCount = {}
var LPS = {}
var price = {}
var demand = {}

function initializeObjects()
{
    for (var i = 0; i < lighterArray.length; i++)
    {
        var currType = lighterArray[i]
        lighterCount[currType] = 0.0;
        LPS[currType] = startingLPS[i];
        price[currType] = startingPrice[i];
        demand[currType] = 1.0;
    }
    displayData()
}

//inc or dec price of each lighter by MARKET_VARIANCE
function updateMarket()
{
    day += 1;
    var incThreshold;
    for (var i = 0; i < lighterArray.length; i++)
    {
        var currType = lighterArray[i];
        var determinant = getRandomInt(1000);
        var variance = price[currType] * MARKET_VARIANCE;

        incThreshold = 500;
        incThreshold = rangeAfterDemand(incThreshold, demand[currType])
        if (determinant >= incThreshold) //increase
        {
            price[currType] += variance;
        }
        else //decrease
        {
            price[currType] -= variance;
        }
    }
    displayData();
}

function makeMoney(lighterType)
{
    var wholeLighters = Math.floor(lighterCount[lighterType]);
    lighterCount[lighterType] -= wholeLighters;
    money += wholeLighters * price[lighterType];
    displayData();
}

function displayData()
{
    document.getElementById("money").innerHTML = MONEY_STR + money.toFixed(2);
    document.getElementById("day").innerHTML = DAY_STR + day;

    for (var i = 0; i < lighterArray.length; i++)
    {
        var currLighterType = lighterArray[i];
        var countID = currLighterType + "-lighters";
        var lpsID = currLighterType + "-lps";
        var priceID = currLighterType + "-price";
        var demandID = currLighterType + "-demand";
        
        document.getElementById(countID).innerHTML = COUNT_STR[currLighterType] + lighterCount[currLighterType].toFixed(2);
        document.getElementById(lpsID).innerHTML = LPS_STR[currLighterType] + LPS[currLighterType].toFixed(2);
        document.getElementById(priceID).innerHTML = DOLLAR_CHAR + price[currLighterType].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //adds commas to prices
        document.getElementById(demandID).innerHTML = "Demand: " + demand[currLighterType].toFixed(2);
    }
}

function rangeAfterDemand(incLower, typeDemand)
{
    if (typeDemand === 1)
    {
        return incLower;
    }
    var lowerBy = ((typeDemand - 1) / 100.0) * 3;
    var newLower = incLower - (lowerBy * incLower);
    return newLower;
}

function updateAllLPS(threshold, updateAmnt)
{
    if (money >= threshold)
    {
        money -= threshold;
        for (var i = 0; i < lighterArray.length; i++)
        {
            var currLighterType = lighterArray[i]
            LPS[currLighterType] += updateAmnt;
        }
        displayData();
    }
}

function updateDemand(lighterType, threshold, updateAmnt)
{
    if (money >= threshold)
    {
        demand[lighterType] += updateAmnt;
        money -= threshold;
        displayData();
    }
}

function unlockLighter(lighterType, threshold)
{
    if (money >= threshold)
    {
        money -= threshold;
        var unlockType = lighterType + '-unlock';
        var info = lighterType + '-info';
        var buttonUnlock = document.getElementById(unlockType);
        var lighterInfo = document.getElementById(info);
        buttonUnlock.style.display = "none";
        lighterInfo.style.display = "block";
        updateLPS(lighterType, 0, 0.05);
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function addCounter(lighterType, amount)
{
    lighterCount[lighterType] += amount
    displayData();
}

window.setInterval(function(){
    for (var i = 0; i < lighterArray.length; i++)
    {
        addCounter(lighterArray[i], LPS[lighterArray[i]] / 10);
    }
}, 100);

window.setInterval(function(){
    updateMarket()
}, 60000);