var request = require('request')

module.exports = function (data, text) {
   	let obj = {
      	method: 'POST',
    	url: 'http://localhost:8191/sendNotification',
       	json: {
	    	text: text,
		    type: "text",
		    sender: data.sender,
		    language: "en",
		    projectId: 'srh_dev_184276895194'
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