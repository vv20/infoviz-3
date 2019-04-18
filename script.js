var dataPath = "economic_freedom_index2019_data.csv";
var correlationPath = "pearson_matrix.csv";

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
const correlationMatrixMargin = {
    top: 70,
    left: 150,
    right: 10,
    bottom: 10
}
const correlationMatrixWidth = 
    1000 - correlationMatrixMargin.left - correlationMatrixMargin.right;
const correlationMatrixHeight = 
    12 * squareSide;

// colour bar constants

function getHTMLColour(min, max, value) {
    if (value < 0) {
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
    return "#" + chan1 + chan2 + chan3;
}

function fillCorrelationMatrix(data) {
    values = data.map((d) => {return d.correlation}, data);
    minValue = Math.min(...values);
    maxValue = Math.max(...values);

    x_values = d3.set(data.map((d) => {return d.x_name})).values();
    y_values = d3.set(data.map((d) => {return d.y_name})).values();

    x_range = []
    for (var i = 0; i < x_values.length; i++) {
        x_range.push(squareSide * i + squareSide / 2);
    }

    y_range = []
    for (var i = 0; i < y_values.length; i++) {
        y_range.push(squareSide * i + squareSide / 2);
    }

    x_scale = d3.scaleOrdinal().domain(x_values)
        .range(x_range);
    x_axis = d3.axisBottom(x_scale)
        .tickFormat((d) => {return d})

    y_scale = d3.scaleOrdinal().domain(y_values)
        .range(y_range);
    y_axis = d3.axisLeft(y_scale)
        .tickFormat((d) => {return d})

    svg = d3.select("#correlationMatrix")
        .append("svg")
        .attr("width", correlationMatrixWidth + 
            correlationMatrixMargin.left + correlationMatrixMargin.right)
        .attr("height", correlationMatrixHeight + 
            correlationMatrixMargin.top + correlationMatrixMargin.bottom)
        .append("g")
        .attr("width", correlationMatrixWidth)
        .attr("height", correlationMatrixHeight)
        .attr("transform", "translate(" + correlationMatrixMargin.left + 
            "," + correlationMatrixMargin.top + ")");

    svg.selectAll("rect")
        .data(data).enter()
        .append("g").append("rect")
        .attr("class", "cell")
        .attr("width", squareSide)
        .attr("height", squareSide)
        .attr("x", (d) => {return x_scale(d.x_name) - squareSide / 2})
        .attr("y", (d) => {return y_scale(d.y_name) - squareSide / 2})
        .attr("fill", (d) => {
            return getHTMLColour(minValue, maxValue, d.correlation)
        });

    svg.append("g").call(y_axis);
    svg.append("g").call(x_axis)
        .attr("transform", "translate(0," + correlationMatrixHeight + ")")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", (d) => {return "rotate(-45)"})
}

function fillColourBar() {
    svg = d3.select("#colourBar")
        .append("svg").attr("width")
}

d3.csv(dataPath).then(function(data) {
});

d3.csv(correlationPath).then((data) => {
    fillCorrelationMatrix(data);
    fillColourBar();
});
