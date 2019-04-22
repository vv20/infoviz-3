function fillSpiderDiagram(country, data) {
    div = d3.select("#spider").html("")
        .style("left", mapWidth + selectorPaneWidth)
        .style("bottom", mapHeight + barChartHeight)
    svg = div.append("svg")
        .attr("width", spiderChartWidth + 200)
        .attr("height", spiderChartHeight)
    // data
    population_extent = d3.extent(data, (d) => {
        return parseFloat(d["Population (Millions)"]);
    });
    population_scale = d3.scaleLinear()
        .domain(population_extent)
        .range([minCircleRadius, maxCircleRadius]);
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
    angle = (i) => {return i * 2 * Math.PI / freedom_indices.length;};
    // title
    svg.append("text")
        .attr("class", "sectionTitle")
        .text(spiderChartTitle + country)
        .attr("x", spiderChartLeftMargin / 2 + barChartLeftMargin)
        .attr("y", spiderChartTopMargin / 2);
    // description
    svg.append("text")
        .attr("class", "description")
        .text("This chart shows the values for each freedom index in")
        .attr("x", spiderChartLeftMargin / 2 + barChartLeftMargin)
        .attr("y", spiderChartTopMargin)
    svg.append("text")
        .attr("class", "description")
        .text("the selected country. The size of the circle in the middle")
        .attr("x", spiderChartLeftMargin / 2 + barChartLeftMargin)
        .attr("y", spiderChartTopMargin * 1.5)
    svg.append("text")
        .attr("class", "description")
        .text("indicates population size of the country.")
        .attr("x", spiderChartLeftMargin / 2 + barChartLeftMargin)
        .attr("y", spiderChartTopMargin * 2)
    svg = svg.append("g")
        .attr("transform", "translate(0," + spiderChartTopMargin + ")");
    // radial axis
    svg.selectAll("line")
        .data(freedom_indices).enter()
        .append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", (d, i) => {return centerX + Math.cos(angle(i)) *
                spiderChartRadius})
        .attr("y2", (d, i) => {return centerY + Math.sin(angle(i)) *
                spiderChartRadius})
        .style("stroke", "black")
        .style("stroke-width", "1");
    // labels
    fin = [""].concat(freedom_index_names)
    svg.selectAll("text")
        .data(fin).enter()
        .append("text")
        .attr("class", "legend")
        .text((d) => {return d})
        .attr("text-anchor", "middle")
        .attr("x", (d, i) => {return centerX + Math.cos(angle(i-1)) *
                spiderChartLegendRadius})
        .attr("y", (d, i) => {return centerY + Math.sin(angle(i-1)) *
                spiderChartLegendRadius})
    // spider chart points
    points = "";
    for (var i = 0; i < freedom_indices.length; i++) {
        x = centerX + Math.cos(angle(i)) * freedom_indices[i];
        y = centerY + Math.sin(angle(i)) * freedom_indices[i];
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
