function fillBarChart(data) {
    metricName = economic_metric_names[selectedEconomicMetric];
    // data
    top10 = data.sort((a, b) => {
        return d3.descending(+a[metricName], +b[metricName])
    }).slice(0, 10);
    top10Countries = [];
    for (var i = 0; i < 10; i++) {
        top10Countries.push(top10[i]["Country Name"]);
    }
    extent = d3.extent(data, (d) => {return parseInt(d[metricName])})
    // clear and set up
    div = d3.select("#barChart").html("");
    svg = div.append("svg")
        .attr("width", barChartWidth)
        .attr("height", barChartHeight)
        .style("position", "relative")
        .style("left", correlationMatrixWidth)
        .style("bottom", correlationMatrixHeight + correlationMatrixTopMargin / 2)
    // title
    svg.append("text")
        .attr("class", "sectionTitle")
        .attr("id", "barChartTitle")
        .attr("y", barChartTopMargin)
        .attr("x", barChartLeftMargin)
        .text(barChartTitle + economic_metric_names[selectedEconomicMetric])
    // container
    g = svg.append("g")
        .attr("width", barChartWidth - barChartLeftMargin)
        .attr("height", barChartHeight - barChartTopMargin - barChartBottomMargin)
        .attr("transform", "translate(" + barChartLeftMargin + "," + 
            barChartTopMargin + ")");
    // scales
    x_range = []
    for (var i = 0; i < 10; i++) {
        x_range.push((i+1) * barChartBarGap + i * barChartBarWidth +
            barChartBarWidth / 2)
    }
    x_scale = d3.scaleOrdinal()
        .domain(top10Countries)
        .range(x_range);
    y_scale = d3.scaleLinear()
        .domain([extent[1], extent[0]])
        .range([0, barChartMaxValue]);
    x_axis = d3.axisBottom(x_scale)
        .tickFormat((d) => {return d});
    y_axis = d3.axisLeft(y_scale)
        .ticks(5)
    // bars
    g.selectAll("rect")
        .data(top10).enter()
        .append("rect")
        .attr("width", barChartBarWidth)
        .attr("height", (d) => {
            return barChartHeight - barChartBottomMargin -
                y_scale(parseInt(d[metricName]));
        })
        .attr("x", (d, i) => {
            return i * barChartBarWidth + (i+1) * barChartBarGap
        })
        .attr("y", (d) => {
            return y_scale(parseInt(d[metricName])) + barChartTopMargin / 2
        })
        .attr("fill", "#" + maxColour)
    // axis
    g.append("g").call(y_axis)
        .attr("transform", "translate(0," + barChartTopMargin + ")");
    yshift = barChartHeight - barChartBottomMargin + barChartTopMargin / 2;
    g.append("g").call(x_axis)
        .attr("transform", "translate(0," + yshift + ")")
        .selectAll("text")
        .attr("class", "legend")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)")
}
