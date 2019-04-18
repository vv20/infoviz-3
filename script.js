var dataPath = "economic_freedom_index2019_data.csv";
var correlationPath = "pearson_matrix.csv";

// correlation matrix constants
const zeroColour1 = 250
const minColour1 = 245;
const maxColour1 = 1
const zeroColour2 = 250
const minColour2 = 6;
const maxColour2 = 78;
const zeroColour3 = 5
const minColour3 = 6;
const maxColour3 = 12;
const squareSide = 20;
const correlationMatrixMargin = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
}
const correlationMatrixWidth = 
    750 - correlationMatrixMargin.left - correlationMatrixMargin.right;
const correlationMatrixHeight = 
    750 - correlationMatrixMargin.top - correlationMatrixMargin.bottom;

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
        x_range.push(squareSide * i);
    }

    y_range = []
    for (var i = 0; i < y_values.length; i++) {
        y_range.push(squareSide * i);
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
        .attr("width", squareSide).attr("height", squareSide)
        .attr("x", (d) => {return x_scale(d.x_name)})
        .attr("y", (d) => {return y_scale(d.y_name)})
        .attr("fill", (d) => {
            return getHTMLColour(minValue, maxValue, d.correlation)
        });
}

d3.csv(dataPath).then(function(data) {
});

d3.csv(correlationPath).then((data) => {
    fillCorrelationMatrix(data);
});
