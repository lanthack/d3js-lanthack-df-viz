var makeClassPieChart = function(width, height) {
    console.log("starting pie chart");

    var prepData = function() {
        var data = [];
        for (var j = 0; j < dataset.types.length; j++) {
            data.push({
                columnName: dataset.columnNames[j],
                type: dataset.types[j],
                value: 1,
                color: typeColors[dataset.types[j]]
            })
        }
        return data;
    }

    var chart;
    var data = prepData();
    var colors = [];
    for (var j = 0; j < data.length; j++) {
        colors.push(data[j].color)
    }
    console.log(colors);
    nv.addGraph(function() {
        chart = nv.models.pie()
            .x(function(d) { return d.columnName; })
            .y(function(d) { return d.value; })
            .color(colors)
            .donut(true)
            .width(width)
            .height(height)
            .padAngle(.06)
            .cornerRadius(5)
            .labelType("key")

        chart.title("Columns");

        d3.select("#classPieChart")
            .datum([data])
            .attr("width", width)
            .attr("height", height)
            .call(chart);

        return chart;
    });
}

var makeScatterChartByIndex = function(values, columnName) {
    console.log(values);
    var prepData = function(values) {
        var data = [];
        data.push({
            key: columnName,
            values: []
        });
        for (var j = 0; j < values.length; j++) {
            data[0].values.push({
                x: j,
                y: values[j],
                size: 5,
                shape: "circle"
            });
        }
        return data;
    }

    var chart;
    nv.addGraph(function() {
        chart = nv.models.scatterChart()
            .showDistX(true)
            .showXAxis(false)
            .showDistY(false)
            .duration(300)
            .color(d3.scale.category10().range());

        // Send a message when the plot is ready
        chart.dispatch.on('renderEnd', function(){
            console.log('render complete');
        });
        chart.xAxis
            .axisLabel("Index")
            .tickFormat(d3.format('d'));
        chart.yAxis
            .axisLabel(columnName)
            .tickFormat(d3.format('.02f'));

        d3.select('body')
            .append('svg')
            .datum(nv.log(prepData(values)))
            .call(chart);
        nv.utils.windowResize(chart.update);
        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        return chart;
    });
    console.log("finished");
}


var makeHistogram = function(values) {
    // values = dataset.listData[dataset.columnNames[0]];
    // values = d3.range(1000).map(d3.random.normal(0, 1));

    var width = 600;
    var height = 250;
    var paddingVertical = 20;
    var paddingHorizontal = 40;
    var marginVertical = 20;
    var marginHorizontal = 40;
    var fontHeight = 15;

    // Statistical information
    var n = values.length;
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    var nbins = Math.min(15, Math.ceil(Math.sqrt(n)));

    // Number formatter
    var formatCount = d3.format(",.1f");

    // Create x-scale
    var xScale = d3.scale.linear()
        .domain([min, max])
        .range([paddingHorizontal + marginHorizontal, width - (paddingHorizontal + marginHorizontal)]);

    // Distribute data into bins
    var histData = d3.layout.histogram()
        .bins(nbins)
        .frequency(true)(values);

    // Find the maximum value on y-scale
    var yMax = d3.max(histData, function(d) { return d.y; });

    // Find a suitable bar width
    var barWidth = Math.floor((width - 2 * (paddingHorizontal + marginHorizontal) - 2 * (nbins + 1))/nbins) - 1
    console.log('barWidth = ' + barWidth);

    // Create y-scale
    var yScale = d3.scale.linear()
        .domain([0, yMax])
        .range([paddingVertical + marginVertical, height - (paddingVertical + marginVertical)]);
    var yScaleReverse = d3.scale.linear()
        .domain([0, yMax])
        .range([height - (paddingVertical + marginVertical), paddingVertical + marginVertical]);

    // Create a color scale
    var colorScale = d3.scale.linear()
        .domain([0, yMax])
        .range([0.75, 0.25]); // (L) Lightness value

    // Create x-axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    // Create y-axis
    var yAxis = d3.svg.axis()
        .scale(yScaleReverse)
        .orient("left")
        .ticks(5);

    // Create an svg object
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add bars to this SVG object
    svg.selectAll("rect")
        .data(histData)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.x); })
        .attr("y", function(d) { return height - (paddingVertical + marginVertical) - yScale(d.y); })
        .attr("width", function(d) { return barWidth; })
        .attr("height", function(d) { return yScale(d.y); })
        .attr("fill", function(d) { return d3.hsl(200, 0.75, colorScale(d.y)); })

    // Add labels to the top of the bars
    svg.selectAll("text")
        .data(histData)
        .enter()
        .append("text")
        .text(function(d) { return formatCount(d.x); })
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return xScale(d.x) + barWidth/2; })
        .attr("y", function(d) { console.log(height - (paddingVertical + marginVertical) - yScale(d.y) + fontHeight); return height - (paddingVertical + marginVertical) - yScale(d.y) + fontHeight; })
        .attr("fill", "white")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")

    // Add x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (height - paddingVertical) + ")")
        .call(xAxis);

    // Add y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + paddingHorizontal + ", 0)")
        .call(yAxis);

};
