// -----------------------------------------------------------------------
// Global Variables
// -----------------------------------------------------------------------
var fileInfo = {};
var dataset = {};
var typeColors = {"integer": "#1f77b4",
                  "float": "#ff7f0e",
                  "date": "#2ca02c",
                  "string": "#d62728"}

// -----------------------------------------------------------------------
// Type checking function
// -----------------------------------------------------------------------

var isInt = function(n) {
    return Number(n) === n && n % 1 === 0;
}

var isFloat = function(n) {
    return Number(n) === n && n % 1 !== 0;
}

var isDate = function(d) {
    return !isNaN(Date.parse(d));
}

// -----------------------------------------------------------------------
// File Input & Parsing
// -----------------------------------------------------------------------
var reader = new FileReader();

function loadFile() {
    console.log("Loading file ... ");
    var file = document.getElementById('fileInput').files[0];
    reader.addEventListener('load', parseFile, false);
    if (file) {
        fileInfo.name = file.name;
        fileInfo.size = file.size;
        fileInfo.type = file.type;
        reader.readAsText(file); // result is stored in reader.result
        printFileDetails(fileInfo);
    }
}

function parseFile() {
    console.log("Parsing file ... ");
    // Default D3 parsing
    // dataset.data = d3.csv.parse(reader.result);

    // Papa Parsing
    dataset.data = Papa.parse(reader.result, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    }).data


    // Collect information about the data
    collectDataInfo();

    // Debug
    // printFile(dataset);

    // Make the plots
    makeClassPieChart(350, 350);
    makeHistogram(dataset.listData[dataset.columnNames[0]]);
    makeScatterChartByIndex(dataset.listData[dataset.columnNames[0]], dataset.columnNames[0]);

    makeHistogram(dataset.listData[dataset.columnNames[1]]);
    makeScatterChartByIndex(dataset.listData[dataset.columnNames[1]], dataset.columnNames[1]);
    // makeHistogram(dataset.listData[dataset.columnNames[1]]);
}

var printFileDetails = function(f) {
    console.log(f.name);
    console.log(f.size);
    document.getElementById("fileName").innerHTML = f.name;
    document.getElementById("fileSize").innerHTML = f.size + ' bytes';
    document.getElementById("fileType").innerHTML = f.type;
}


var collectDataInfo = function() {
    // Get a list of column names
    // If there are spaces around the columns, those are preserved.
    dataset.columnNames = [];
    for (var key in dataset.data[0]) {
        if (dataset.data[0].hasOwnProperty(key) && key != "__parsed_extra")  {
            dataset.columnNames.push(key);
        }
    }

    // Get number of rows and columns
    dataset.ncol = dataset.columnNames.length;
    dataset.nrow = dataset.data.length;

    // Isolate the columns into lists
    dataset.listData = {};
    for (var i = 0; i < dataset.ncol; i++) {
        dataset.listData[dataset.columnNames[i]] = [];
        for (var j = 0; j < dataset.nrow; j++) {
            dataset.listData[dataset.columnNames[i]].push(dataset.data[j][dataset.columnNames[i]])
        }
    }


    // Get type of each column
    // Data cannot contain missing values for now.
    dataset.jsTypes = [];
    dataset.types = [];
    for (var i = 0; i < dataset.ncol; i++) {
        // Get JS types
        dataset.jsTypes[i] = typeof(dataset.data[0][dataset.columnNames[i]]);
        dataset.types[i] = dataset.jsTypes[i];

        // Get more accurate types
        if (dataset.jsTypes[i] == "number") {
            // Check whether this column is integer or float
            if (dataset.listData[dataset.columnNames[i]].every(isInt)) {
                dataset.types[i] = 'integer';
            } else {
                dataset.types[i] = 'float';
            }
        } else if (dataset.jsTypes[i] == "string") {
            // Check if this column is a valid date
            if (dataset.listData[dataset.columnNames[i]].every(isDate)) {
                dataset.types[i] = 'date'
            }
        }
    }
}


var printFile = function(ds) {
    console.log(ds.columnNames);

    var columnNameString = '';
    for(var i = 0; i < ds.columnNames.length; i++) {
        columnNameString = columnNameString + ds.columnNames[i] + ' ';
    }
    d3.select('body').append('p').text(columnNameString);

    d3.select('body')
      .data(ds.data)
      .enter()
      .append('p')
      .text(function(rowObject) {
        console.log(rowObject);
        row = '';
        for(var i = 0; i < ds.columnNames.length; i++) {
            console.log(rowObject[ds.columnNames[i]]);
            row = row + ' ' + rowObject[ds.columnNames[i]];
        }
        return row;
      })
}