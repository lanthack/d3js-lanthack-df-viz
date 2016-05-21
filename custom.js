// File Input & Parsing

var reader = new FileReader();
var fileSize;
var fileName;
var fileType;
var dataset;

function loadFile() {
    console.log("Loading file ... ");
    var file = document.getElementById('fileInput').files[0];
    reader.addEventListener('load', parseFile, false);
    if (file) {
        fileName = file.name;
        fileSize = file.size;
        fileType = file.type;
        reader.readAsText(file);
        printFileDetails();
    }
}

function parseFile() {
    console.log("Parsing file ... ");
    dataset = d3.csv.parse(reader.result);
    printFile(dataset);
}

var printFileDetails = function() {
    console.log(fileName);
    console.log(fileSize);
    d3.select('body').append('p').text('File Name: ' + fileName);
    d3.select('body').append('p').text('File Size: ' + fileSize + 'bytes');
    d3.select('body').append('p').text('File Type: ' + fileType);
}

var printFile = function(data) {
    // Get a list of keys
    var keys = [];
    for (var key in data[0]) {
        if (data[0].hasOwnProperty(key)) keys.push(key);
    }
    console.log(keys);

    var columnNameString = '';
    for(var i = 0; i < keys.length; i++) {
        columnNameString = columnNameString + keys[i] + ' ';
    }
    d3.select('body').append('p').text(columnNameString);

    d3.select('body')
      .data(data)
      .enter()
      .append('p')
      .text(function(rowObject) {
        console.log(rowObject);
        row = '';
        for(var i = 0; i < keys.length; i++) {
            console.log(rowObject[keys[i]]);
            row = row + ' ' + rowObject[keys[i]];
        }
        return row;
      })
}


// Main
