selectedEconomicMetric = 0
selectedCountry = "";

function getColour(data, country) {
    extent = d3.extent(data, (d) => {
        return parseInt(d[economic_metric_names[selectedEconomicMetric]]);
    });
    for (var i = 0; i < data.length; i++) {
        if (data[i]["Country Name"] == country) {
            metricName = economic_metric_names[selectedEconomicMetric];
            value = parseInt(data[i][metricName]);
            return getHTMLColour(extent[0], extent[1], value, false);
        }
    }
}

function fillMap(data) {
    div = d3.select("#map")
        .style("width", mapWidth + selectorPaneWidth)
        .style("height", mapHeight)
    // title
    div.append("text")
        .attr("class", "sectionTitle")
        .text(mapTitle)
        .attr("x", mapLeftMargin / 2)
        .attr("y", mapTopMargin / 2);
    // container for the actual map
    map = div.append("div")
        .attr("x", mapLeftMargin)
        .attr("y", mapTopMargin)
        .style("width", mapInternalWidth)
        .style("height", mapInternalHeight)
        .attr("id", "mapInternal")
    // actual map
    d3.json("countries.geojson").then((mapData) => {
        map = L.map("mapInternal").setView([0,0], 1);
        style = function(feature) {
            return {
                fillColor: getColour(data, feature.properties.ADMIN),
                weight: 2,
                color: "black"
            };
        }
        L.geoJson(mapData, {style: style}).addTo(map);
    });
    // selectors
    selectors = div.append("svg")
        .style("position", "relative")
        .style("left", mapLeftMargin + mapInternalWidth)
        .style("bottom", mapInternalHeight)
        .attr("width", selectorPaneWidth)
        .attr("height", mapInternalHeight)
        .selectAll("g")
        .data(economic_metric_names).enter()
        .append("g")
        .attr("transform", (d, i) => {
            return "translate(0," + i * selectorHeight + ")";
        })
    selectors.append("rect")
        .attr("width", selectorPaneWidth)
        .attr("height", selectorHeight)
        .attr("fill", (d, i) => {
                if (selectedEconomicMetric == i) {
                    return "#" + maxColour;
                }
                else {
                    return "#" + zeroColour;
                }
            })
        .style("opacity", 0.5)
    selectors.append("text")
        .attr("class", "legend")
        .text((d) => {return d})
        .attr("x", selectorPaneWidth / 2)
        .attr("y", selectorHeight / 2)
        .style("text-anchor", "middle")
}
