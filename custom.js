// File Input & Parsing

var reader = new FileReader();
var fileSize;
var fileName;
var dataset;

function loadFile() {
    console.log("Loading file ... ");
    var file = document.getElementById('fileInput').files[0];
    reader.addEventListener('load', parseFile, false);
    if (file) {
        fileName = file.name;
        fileSize = file.size;
        reader.readAsText(file);
    }
}

function parseFile() {
    console.log("Parsing file ... ");
    dataset = d3.csv.parse(reader.result)
}

function printFileDetails() {
    console.log(fileName);
    console.log(fileSize);
    d3.select('body').append('p').text('File Name: ' + fileName);
    d3.select('body').append('p').text('File Size: ' + fileSize + 'bytes');
}

function printFile(data) {
    // Get a list of keys
    var keys = [];
    for (var key in data[0]) {
        if (data[0].hasOwnProperty(key)) keys.push(key);
    }
    console.log(keys);

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

