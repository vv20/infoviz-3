var dataPath = "cleaned_dataset.csv";
var correlationPath = "pearson_matrix.csv";

freedom_index_names = [
    "Property Rights",
    "Judical Effectiveness",
    "Government Integrity",
    "Tax Burden",
    "Gov't Spending",
    "Fiscal Health",
    "Business Freedom",
    "Labor Freedom",
    "Monetary Freedom",
    "Trade Freedom",
    "Investment Freedom ",
    "Financial Freedom"
]

economic_metric_names = [
    "Tariff Rate (%)",
    "Income Tax Rate (%)",
    "Corporate Tax Rate (%)",
    "Tax Burden % of GDP",
    "Gov't Expenditure % of GDP",
    "GDP (Billions, PPP)",
    "GDP Growth Rate (%)",
    "5 Year GDP Growth Rate (%)",
    "GDP per Capita (PPP)",
    "Unemployment (%)",
    "Inflation (%)",
    "FDI Inflow (Millions)",
    "Public Debt (% of GDP)"
]

// correlation matrix constants
const zeroColour = "fafa05";
const zeroColour1 = parseInt(zeroColour.substring(0,2), 16);
const zeroColour2 = parseInt(zeroColour.substring(2,4), 16);
const zeroColour3 = parseInt(zeroColour.substring(4,6), 16);
const maxColour = "014e0c";
const maxColour1 = parseInt(maxColour.substring(0,2), 16);
const maxColour2 = parseInt(maxColour.substring(2,4), 16);
const maxColour3 = parseInt(maxColour.substring(4,6), 16);
const minColour = "f50606"
const minColour1 = parseInt(minColour.substring(0,2), 16);
const minColour2 = parseInt(minColour.substring(2,4), 16);
const minColour3 = parseInt(minColour.substring(4,6), 16);
const squareSide = 40;
const correlationMatrixLeftMargin = 120;
const correlationMatrixRightMargin = 400;
const correlationMatrixTopMargin = 40;
const correlationMatrixBottomMargin = 150;
const correlationMatrixWidth = 13 * squareSide + correlationMatrixLeftMargin +
    correlationMatrixRightMargin;
const correlationMatrixHeight = 12 * squareSide + correlationMatrixTopMargin +
    correlationMatrixBottomMargin;
const correlationMatrixTitle = "Correlation Between Economic Performance and Freedom Indices";

// colour bar constants
const colourBarLeftMargin = 120;
const colourBarWidth = 2 * squareSide;
const colourBarHeight = 12 * squareSide;

// map constants
const mapTitle = "Economic Performance Compared Worldwide";
const mapLeftMargin = 60;
const mapTopMargin = 40;
const mapInternalWidth = 600;
const mapInternalHeight = 400;
const mapWidth = mapInternalWidth + mapLeftMargin;
const mapHeight = mapInternalHeight + mapTopMargin;
const selectorHeight = mapInternalHeight / economic_metric_names.length;
const selectorPaneWidth = 200;

// spider chart constants
const spiderChartLeftMargin = 120
const spiderChartHeight = 500;
const spiderChartWidth = 500;
const minCircleRadius = 10;
const maxCircleRadius = 100;
const spiderChartCenterColour = "#C10505";
const spiderChartRadius = 150;
const spiderChartLegendRadius = 190;
const spiderChartFillColour = "#F43E62";

function getHTMLColour(min, max, value, withNegatives) {
    if (value < 0 && withNegatives) {
        m1 = (minColour1 - zeroColour1) / Math.abs(min);
        m2 = (minColour2 - zeroColour2) / Math.abs(min);
        m3 = (minColour3 - zeroColour3) / Math.abs(min);
    }
    else {
        m1 = (maxColour1 - zeroColour1) / Math.abs(max);
        m2 = (maxColour2 - zeroColour2) / Math.abs(max);
        m3 = (maxColour3 - zeroColour3) / Math.abs(max);
    }
    chan1 = Math.round(m1 * Math.abs(value) + zeroColour1).toString(16);
    chan2 = Math.round(m2 * Math.abs(value) + zeroColour2).toString(16);
    chan3 = Math.round(m3 * Math.abs(value) + zeroColour3).toString(16);
    if (chan1.length < 2) {
        chan1 = "0" + chan1;
    }
    if (chan2.length < 2) {
        chan2 = "0" + chan2;
    }
    if (chan3.length < 2) {
        chan3 = "0" + chan3;
    }
    result = "#" + chan1 + chan2 + chan3;
    return result.toUpperCase();
}

d3.csv(dataPath).then(function(data) {
    fillMap(data);
    fillSpiderDiagram("China", data);
});

d3.csv(correlationPath).then((data) => {
    fillCorrelationMatrix(data);
});
