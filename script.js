var dataPath = "cleaned_dataset.csv";
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
    top: 10,
    left: 150,
    right: 10,
    bottom: 10
}
const correlationMatrixWidth = 
    800 - correlationMatrixMargin.left - correlationMatrixMargin.right;
const correlationMatrixHeight = 
    12 * squareSide;

// colour bar constants
const colourBarWidth = 2 * squareSide;
const colourBarHeight = 12 * squareSide;

// spider chart constant
const spiderChartHeight = 500;
const spiderChartWidth = 500;
const minCircleRadius = 10;
const maxCircleRadius = 100;
const spiderChartCenterColour = "#C10505";
const spiderChartRadius = 150;
const spiderChartLegendRadius = 190;
const spiderChartFillColour = "#F43E62";

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
    colourBar = d3.select("#colourBar")
        .style("left", correlationMatrixWidth)
        .style("bottom", correlationMatrixHeight * 2 + squareSide);
    svg = d3.select("#colourBar").append("svg");
    // gradient definition
    topHalfGradient = svg
        .append("linearGradient")
        .attr("y1", "0%")
        .attr("y2", "100%")
        .attr("x1", "0")
        .attr("x2", "0")
        .attr("id", "topHalfGradient")
    topHalfGradient
        .append("stop")
        .attr("offset", "0")
        .attr("stop-color", "#" + maxColour)
    topHalfGradient
        .append("stop")
        .attr("offset", "1")
        .attr("stop-color", "#" + zeroColour)
    bottomHalfGradient = svg
        .append("linearGradient")
        .attr("y1", "0%")
        .attr("y2", "100%")
        .attr("x1", "0")
        .attr("x2", "0")
        .attr("id", "bottomHalfGradient")
    bottomHalfGradient
        .append("stop")
        .attr("offset", "0")
        .attr("stop-color", "#" + zeroColour)
    bottomHalfGradient
        .append("stop")
        .attr("offset", "1")
        .attr("stop-color", "#" + minColour)
    // colour bar construction
    colourBar = svg.append("g")
        .attr("transform", "translate(" + correlationMatrixMargin.left + "," +
            correlationMatrixMargin.top + ")")
    topHalf = colourBar.append("g")
        .append("rect")
        .attr("width", colourBarWidth)
        .attr("height", colourBarHeight / 2)
        .attr("fill", "url(#topHalfGradient)")
        .style("top-stroke-width", "5px")
    bottomHalf = colourBar.append("g")
        .attr("transform", "translate(0," + colourBarHeight / 2 + ")")
        .append("rect")
        .attr("width", colourBarWidth)
        .attr("height", colourBarHeight / 2)
        .attr("fill", "url(#bottomHalfGradient)")
    // scale construction
    y_domain = [
        "Directly Proportional",
        "Unaffected",
        "Inversely Proportional"
    ];
    y_range = [0, colourBarHeight / 2, colourBarHeight];
    y_scale = d3.scaleOrdinal().domain(y_domain)
        .range(y_range);
    y_axis = d3.axisLeft(y_scale)
        .tickFormat((d) => {return d});
    colourBar.append("g").call(y_axis);
}

function fillSpiderDiagram(country, data) {
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
    svg = d3.select("#spider").append("svg")
        .attr("width", spiderChartWidth)
        .attr("height", spiderChartHeight)
    population_extent = d3.extent(data, (d) => {
        return parseFloat(d["Population (Millions)"]);
    });
    population_scale = d3.scaleLinear()
        .domain(population_extent)
        .range([minCircleRadius, maxCircleRadius]);
    // get the data
    population = 0;
    freedom_indices = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i]["Country Name"] == country) {
            population = data[i]["Population (Millions)"];
            for (var j = 0; j < freedom_index_names.length; j++) {
                freedom_indices.push(parseFloat(data[i][freedom_index_names[j]]));
            }
        }
    }
    centerX = spiderChartWidth / 2;
    centerY = spiderChartHeight / 2;
    points = "";
    for (var i = 0; i < freedom_indices.length; i++) {
        // radial axis
        angle = i * 2 * Math.PI / freedom_indices.length;
        svg.append("line")
            .attr("x1", centerX)
            .attr("y1", centerY)
            .attr("x2", centerX + Math.cos(angle) * spiderChartRadius)
            .attr("y2", centerY + Math.sin(angle) * spiderChartRadius)
            .style("stroke", "black")
            .style("stroke-width", "1");
        // labels
        svg.append("text")
            .attr("class", "legend")
            .text(freedom_index_names[i])
            .attr("text-anchor", "middle")
            .attr("x", centerX + Math.cos(angle) * spiderChartLegendRadius)
            .attr("y", centerY + Math.sin(angle) * spiderChartLegendRadius)
        // spider chart points
        x = centerX + Math.cos(angle) * freedom_indices[i];
        y = centerY + Math.sin(angle) * freedom_indices[i];
        points += x.toString() + "," + y.toString() + " ";
    }
    svg.append("polygon")
        .attr("points", points)
        .style("stroke-width", "1")
        .style("stroke", "black")
        .style("fill", spiderChartFillColour)
        .style("opacity", "0.75");
    // central circle
    svg.append("circle")
        .attr("r", population_scale(population))
        .attr("cx", centerX)
        .attr("cy", centerY)
        .style("fill", spiderChartCenterColour)
        .style("opacity", "0.75");
}

function fillMap(data) {
    d3.json("countries.json").then((mapData) => {
        map = L.map("map").setView([0,0], 1);
        L.geoJson(mapData).addTo(map);
    });
}

d3.csv(dataPath).then(function(data) {
    fillSpiderDiagram("China", data);
});

d3.csv(correlationPath).then((data) => {
    fillCorrelationMatrix(data);
    fillColourBar();
});
