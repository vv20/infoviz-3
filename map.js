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
        geoJsonLayer = L.geoJson(mapData, {style: style}).addTo(map);
    });
    // selectors
    mapChange = (feature) => {
        return {
            fillColor: getColour(data, feature.properties.ADMIN)
        };
    }
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
        .on("mouseover", (d,i) => {
            if (selectedEconomicMetric == i) return;
            d3.select("#selector" + i)
                .attr("fill", selectorUnselectedHoverColour);
        })
        .on("mouseout", (d,i) => {
            if (selectedEconomicMetric == i) return;
            d3.select("#selector" + i)
                .attr("fill", selectorUnselectedColour);
        })
        .on("click", (d,i) => {
            if (selectedEconomicMetric == i) return;
            d3.select("#selector" + i)
                .attr("fill", selectorSelectedColour);
            d3.select("#selector" + selectedEconomicMetric)
                .attr("fill", selectorUnselectedColour);
            selectedEconomicMetric = i;
            geoJsonLayer.setStyle(mapChange)
        })
    selectors.append("rect")
        .attr("id", (d, i) => {return "selector" + i;})
        .attr("width", selectorPaneWidth)
        .attr("height", selectorHeight)
        .attr("fill", (d, i) => {
                if (selectedEconomicMetric == i) {
                    return selectorSelectedColour;
                }
                else {
                    return selectorUnselectedColour;
                }
            })
        .style("fill-opacity", 0.7)
    selectors.append("text")
        .attr("class", "legend")
        .text((d) => {return d})
        .attr("x", selectorPaneWidth / 2)
        .attr("y", selectorHeight / 2)
        .style("text-anchor", "middle")
}
