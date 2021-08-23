// src/index.js

// Include the core fusioncharts file from core
import FusionCharts from 'fusioncharts/core';

// Include the spline chart from viz folder
import Spline from 'fusioncharts/viz/spline';

// Include the fusion theme
import FusionTheme from 'fusioncharts/themes/es/fusioncharts.theme.fusion';

// Add the div tag for the chart container
const myDiv = document.createElement('div');
myDiv.id = 'chart-container';
document.body.appendChild(myDiv);

// Specify your key here
let YOUR_KEY = 'SUBSCRIPTION_KEY'


// Construct a query for each year and fetch the data
// Create a data JSON and datasource JSON for rendering the chart
async function main() {    
    var dataJson = [];
    let queryPrefix = 'http://api.coinlayer.com/';
    let querySuffix = '?access_key=' + YOUR_KEY + '&symbols=BTC';
    //Construct the query string for 10 years starting from 2012
    for (var i=0;i<10;++i){
        var dateStr = parseInt(2012 + i) + '-01-01';
        var queryStr = queryPrefix + dateStr + querySuffix;
        //Call coinlayer API
        let response = await fetch(queryStr);
        let responseJson = await response.json();
        if (response.ok){ 
            //construct the data JSON       
            dataJson.push({label: dateStr, value:responseJson.rates.BTC})
        }    
        else {
            alert('Error reading data from Coinlayer API');
            return;
        }
    }
    var dataSource = constructDataSource(dataJson);
    renderChart(dataSource);
}


//constructs JSON text for 'dataSource' key
function constructDataSource(data){
  var dataSource = {"chart": {
        "caption": "Historical Rates of Bitcoin on January 01 Over the Past 10 Years",
        "subcaption": "Data Source: https://coinlayer.com/",
        "xAxisName": "Date",
        "YAxisName": "Bitcoin Exchange Rate",
        "ynumbersuffix": "$",
        "xnumbersuffix": "",
        "theme": "fusion",
        "plotToolText": "<b>$dataValue</b> BTC rate on <b>$label</b>",
        "anchorbgcolor": "#ff00ff",
        "palettecolors": "#ff00ff"
    }, 
    data: data};    
    return dataSource;
}

// Draw the chart
function renderChart(dataSrc){

    FusionCharts.addDep(Spline);
    FusionCharts.addDep(FusionTheme);

    //Chart Configurations
    const chartConfig = {
        type: 'spline',
        renderAt: 'chart-container',
        width: '80%',
        height: '600',
        dataFormat: 'json',
        dataSource: dataSrc
    }

    // Create an instance of FusionCharts object with chart options 
    // and render the chart
    var chartInstance = new FusionCharts(chartConfig);
    chartInstance.render();
    console.log(JSON.stringify(chartConfig));
}

//Call main method 
main();