let fs = require('fs')
let request = require('request')

fs.readFile('./index.js', function(err, data) {
	pid = data.toString()
	pid = pid.substring(pid.search('projectId:'), pid.search('dashbotKey:'))
	pid = pid.split('"')[1]
	request.get('https://parramato.com/bot-view/'+pid+'/dev/js/bundle.test.js', (err, http, body)=>{
		dataset = body.substring(body.search('let passphrase'), body.search('let checkUrl'))
	    console.log(dataset)
		fs.readFile('./static/js/bundle.test.js', function(err, data) {
		    all = data.toString()
		    filter = all.substring(all.search('let passphrase'), all.search('let checkUrl'))
		    final = all.replace(filter, dataset)
		    fs.writeFile('./static/js/bundle.test.js', final, async function (err) {
				if (err) throw err;
			  	console.log('Saved regular!');
			  	let minified = await minify('./static/js/bundle.test.js')
			  	fs.writeFile('./static/js/bundle.min.js', minified, function (err) {
			  		console.log('Minified!')
			  	})
			});
		})
	})
})

async function minify(path){
	return new Promise(function(resolve, reject){
		fs.readFile(path, function(err, data) {
			var options = { 
				method: 'POST',
			  	url: 'https://javascript-minifier.com/raw',
			  	headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			  	form: { input: data.toString() } 
			};
			request(options, function (error, response, body) {
				if (error) throw new Error(error);
				resolve(body);
			});
		})
	})
}