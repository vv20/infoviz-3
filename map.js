selectedEconomicMetric = 0
selectedCountry = "China";

function getColour(data, country) {
    extent = d3.extent(data, (d) => {
        return parseInt(d[economic_metric_names[selectedEconomicMetric]]);
    });
    value = getCurrentMetric(data, country);
    return getHTMLColour(extent[0], extent[1], value, false);
}

/**
 * Code adapted from https://leafletjs.com/examples/choropleth/
 */
function fillMap(data) {
    div = d3.select("#map")
        .style("width", mapWidth + selectorPaneWidth)
        .style("height", mapHeight)
        .style("position", "relative")
        .style("bottom", barChartHeight)
    // title
    div.append("text")
        .attr("class", "sectionTitle")
        .text(mapTitle)
        .append("br");
    // subtitle
    div.append("text")
        .attr("class", "sectionTitle")
        .attr("id", "mapSubtitle")
        .attr("x", mapLeftMargin / 2)
        .text(economic_metric_names[selectedEconomicMetric] + ": " +
            getCurrentMetric(data, selectedCountry))
        .append("br");
    // description
    div.append("text")
        .attr("class", "description")
        .text("Click on a country to see its freedom indices, or click on an " +
            "economic metric to see how it varies worldwide.")
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
        // style setting function
        style = (feature) => {
            return {
                fillColor: getColour(data, feature.properties.ADMIN),
                weight: 2,
                color: "black",
                fillOpacity: 1
            };
        }
        // click callback
        click = (country) => {
            return (feature) => {
                d3.select("#mapSubtitle")
                    .html("")
                    .text(economic_metric_names[selectedEconomicMetric] +
                    ": " + getCurrentMetric(data, country))
                    .append("br");
                selectedCountry = country;
                fillSpiderDiagram(country, data);
            }
        }
        // hover callback
        hover = (country) => {
            return (feature) => {
                d3.select("#mapSubtitle")
                    .html("")
                    .text(economic_metric_names[selectedEconomicMetric] +
                        ": " + getCurrentMetric(data, selectedCountry) + " (" +
                        getCurrentMetric(data, country) + ")")
                    .append("br");
            }
        }
        // unhover callback
        unhover = (feature) => {
            d3.select("#mapSubtitle")
                .html("")
                .text(economic_metric_names[selectedEconomicMetric] +
                ": " + getCurrentMetric(data, selectedCountry))
                    .append("br");
        }
        // binding function
        onEachFeature = (feature, layer) => {
            layer.on({
                mouseover: hover(feature.properties.ADMIN),
                mouseout: unhover,
                click: click(feature.properties.ADMIN)
            })
        }
        geoJsonLayer = L.geoJson(mapData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });
    // selectors
    mapChange = (feature) => {
        return {
            fillColor: getColour(data, feature.properties.ADMIN)
        };
    }
    selectors = div.append("svg")
        .style("position", "relative")
        .style("left", mapInternalWidth + mapRightMargin)
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
            d3.select("#mapSubtitle")
                .html("")
                .text(economic_metric_names[selectedEconomicMetric] + ":")
                .append("br");
            fillBarChart(data);
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
