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
    // svg
    svg = d3.select("#correlationMatrix")
        .append("svg")
        .attr("width", correlationMatrixWidth)
        .attr("height", correlationMatrixHeight);
    // title
    svg.append("text")
        .attr("class", "sectionTitle")
        .text(correlationMatrixTitle)
        .attr("x", correlationMatrixLeftMargin / 2)
        .attr("y", correlationMatrixTopMargin / 2)
    // container
    g = svg.append("g")
        .attr("width", correlationMatrixWidth - correlationMatrixLeftMargin)
        .attr("height", correlationMatrixHeight - correlationMatrixTopMargin)
        .attr("transform", "translate(" + correlationMatrixLeftMargin + "," +
            correlationMatrixTopMargin + ")");
    // cells
    g.selectAll("rect")
        .data(data).enter()
        .append("g").append("rect")
        .attr("class", "cell")
        .attr("width", squareSide)
        .attr("height", squareSide)
        .attr("x", (d) => {return x_scale(d.x_name) - squareSide / 2})
        .attr("y", (d) => {return y_scale(d.y_name) - squareSide / 2})
        .attr("fill", (d) => {
            return getHTMLColour(minValue, maxValue, d.correlation, true);
        });
    // y axis
    g.append("g").call(y_axis);
    // x axis
    yshift = correlationMatrixHeight - correlationMatrixTopMargin -
        correlationMatrixBottomMargin;
    g.append("g").call(x_axis)
        .attr("transform", "translate(0," + yshift + ")")
        .selectAll("text")
        .attr("class", "legend")
        .style("text-anchor", "end")
        .attr("transform", (d) => {return "rotate(-45)"})
    // colour bar gradient definition
    topHalfGradient = g
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
    bottomHalfGradient = g
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
    xoffset = correlationMatrixWidth - correlationMatrixRightMargin +
        colourBarLeftMargin;
    colourBar = svg.append("g")
        .attr("transform", "translate(" + xoffset + "," + 
            correlationMatrixTopMargin + ")");
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
