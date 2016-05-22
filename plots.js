// var makeClassPieChart = function(width, height) {
//     nv.addGraph(function() {
//         var chart = nv.models.pieChart()
//             .donut(true)
//             .width(width)
//             .height(height)
//             .x(function(x) { console.log(x); return x })
//             .y(function(x) { return 1 })
//             .color(function(d, i) { return "red" })
//             .legendPosition("right")
//             // .labelType('key')
//             .padAngle(.03)
//             .cornerRadius(5)

//         d3.select("#classPieChart")
//         .datum(dataset.types)
//         .transition().duration(1200)
//         .attr('width', width)
//         .attr('height', height)
//         .call(chart);

//         return chart;
//     });
// }

var makeHistogram2 = function(values) {
    values = d3.range(1000).map(d3.random.normal(0, 1));
    // values = dataset.listData[dataset.columnNames[0]];
    var width = 600;
    var height = 250;
    var n = values.length;
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    console.log('min = ' + min);
    console.log('max = ' + max);

    var formatCount = d3.format(",.1f");

    var xScale = d3.scale.linear()
        .domain([min, max])
        .nice()
        .range([0, width]);

    var histData = d3.layout.histogram()
        .bins(25)
        .frequency(true)(values);

    var yMax = d3.max(histData, function(d) { return d.y; });
    console.log('yMax = ' + yMax);

    var yScale = d3.scale.linear()
        .domain([0, yMax])
        .range([0, height]);

    var colorScale = d3.scale.linear()
        .domain([0, yMax])
        .range([0.75, 0.25]); // Lightness value

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    // Create an svg object
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (height) + ")")
        .call(xAxis);

    // Add y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 0 + ", 0)")
        .call(yAxis);

    // Add bars to this svg object
    svg.selectAll("rect")
        .data(histData)
        .enter()
        .append("rect")
        .attr("x", function(d) { console.log('d = ' + d); return xScale(d.x); })
        .attr("y", function(d) { console.log(height - yScale(d.y)); return height - yScale(d.y); })
        .attr("width", function(d) { return 20; })
        .attr("height", function(d) { console.log('yScale(' + d.y + ') = ' + yScale(d.y)); return yScale(d.y); })
        .attr("fill", function(d) { return d3.hsl(200, 0.75, colorScale(d.y)); })

    // Add labels to the top of the bars
    svg.selectAll("text")
        .data(histData)
        .enter()
        .append("text")
        .text(function(d) { return formatCount(d.x); })
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return xScale(d.x) + 10; })
        .attr("y", function(d) { return height; })
        // .attr("fill", "black")
        .attr("y", function(d) { return height - yScale(d.y) + 14; })
        .attr("fill", "white")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")

};

// var makeHistogram = function(values) {
//     values = d3.range(1000).map(d3.random.normal(0, 1));
//     console.log(values);
//     // Variables
//     var n = values.length;
//     var max = Math.max.apply(null, values);
//     var min = Math.min.apply(null, values);
//     console.log('min = ' + min);
//     console.log('max = ' + max);

//     // Make this an input to the function
//     var margin = {top: 10, right: 30, bottom: 30, left: 30},
//     width = 560 - margin.left - margin.right,
//     height = 300 - margin.top - margin.bottom;

//     // A formatter for counts.
//     var formatCount = d3.format(",.0f");

//     // Create a linear scale for the x-axis
//     minX = Math.floor(min - (max - min)/n)
//     maxX = Math.ceil(max + (max - min)/n)
//     console.log('minX = ' + minX);
//     console.log('maxX = ' + maxX);
//     var x = d3.scale.linear()
//         .domain([minX, maxX]) // Input values
//         .range([0, width]); // Output values

//     // Generate a histogram using uniformly spaced bins
//     // Number of bins = sqrt(n)
//     var nbins = Math.ceil(Math.sqrt(n));
//     console.log('nbins = ' + nbins);
//     var data = d3.layout.histogram()
//         .bins(x.ticks(nbins))
//         (values);
//     console.log(data);
//     console.log(data[0]);
//     console.log(data[0].dx);
//     console.log(x(data[0].dx));

//     // Create a linear scale for the y-axis
//     var y = d3.scale.linear()
//         .domain([0, d3.max(data, function(d) { return d.y; })])
//         .range([height, 0]); // Output values are inverted to match SVG y-axis direction

//     // Create x-axis
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom");

//     var svg = d3.select("body").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     var bar = svg.selectAll(".bar")
//         .data(data)
//         .enter().append("g")
//         .attr("class", "bar")
//         .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

//     bar.append("rect")
//         .attr("x", 1)
//         .attr("width", x(data[0].dx) - 1)
//         .attr("height", function(d) { return height - y(d.y); });

//     bar.append("text")
//         .attr("dy", ".75em")
//         .attr("y", 6)
//         .attr("x", x(data[0].dx) / 2)
//         .attr("text-anchor", "middle")
//         .text(function(d) { return formatCount(d.y); });

//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);
// }
