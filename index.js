var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var path = path = require('path');

var search = process.argv[2]
var picArray = []

// uses Cheerio to grab the necessary <td> elements from each <tr>, then returns them in it to an array.
function organizepic(body) {
	var $ = cheerio.load(body);

  $('tr').each(function() {
  	var permissions = $(this).children().first().text();
  	var fileName = $(this).children().last().text();
 		var Ext = path.extname(fileName);
 		if (search) {
 			if (Ext === search) {
 				picArray.push(permissions + "," + fileName + "," + Ext + '\n');
 			}
 		} else {
 			picArray.push(permissions + "," + fileName + "," + Ext + '\n');
 		}
 	});
  return picArray
}

// appends the array of information to a csv file, deleting the contents of the file beforehand
function writeToCsv(pictures) {
	pictures.forEach (function(picture) {
		fs.writeFile('images.csv', '')
		fs.appendFile('images.csv', picture)
	})
}

//main website request where it pulls the data and calls the above functions
request('http://substack.net/images/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var array = organizepic(body);
  	writeToCsv(array);
  } else console.log(error)
})