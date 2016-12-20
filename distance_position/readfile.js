var fs = require('fs');

var filename =__dirname+'/xlog/oct.06.2016.16.16.38/positioning.index.log';
fs.readFileSync(filename, 'utf8').
split(/\r?\n/).
map(function (line) {
	if(line.indexOf('0=') > -1 || line.indexOf('1=') > -1 || line.indexOf('2=') > -1 || line.indexOf('squares=') > -1 ){
		console.log(line);
		if(line.indexOf('squares=') > -1){
			console.log("<<===========================>>")
		}
	}
})