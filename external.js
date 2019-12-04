var request = require('request')

module.exports = function (data, text) {
   	let obj = {
      	method: 'POST',
    	url: 'http://localhost:8192/sendNotification',
       	json: {
	    	text: text,
		    type: "text",
		    sender: data.sender,
		    language: "en",
		    projectId: 'Alpha Version_586886576888'
		}
   	}
   	return runRequest(obj)
}

function runRequest(options){
	return new Promise(function(resolve,reject){
		request(options, function(error, response, body){
			if(error){
				reject(error)
			}
			resolve(body)
		})
	})
}