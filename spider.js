function fillSpiderDiagram(country, data) {
    div = d3.select("#spider").html("")
        .style("left", mapWidth + selectorPaneWidth)
        .style("bottom", mapHeight)
    svg = div.append("svg")
        .attr("width", spiderChartWidth)
        .attr("height", spiderChartHeight)
        .style("position", "relative")
        .style("left", spiderChartLeftMargin)
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
    angle = (i) => {return i * 2 * Math.PI / freedom_indices.length;};
    // title
    svg.append("text")
        .attr("class", "sectionTitle")
        .text(spiderChartTitle + country)
        .attr("x", spiderChartLeftMargin / 2)
        .attr("y", spiderChartTopMargin / 2)
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
    svg.selectAll("text")
        .data(freedom_index_names).enter()
        .append("text")
        .attr("class", "legend")
        .text((d) => {return d})
        .attr("text-anchor", "middle")
        .attr("x", (d, i) => {return centerX + Math.cos(angle(i)) *
                spiderChartLegendRadius})
        .attr("y", (d, i) => {return centerY + Math.sin(angle(i)) *
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
