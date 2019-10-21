var request = require('request')
var sendExternalMessage = require('../../external.js')

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

module.exports={

	q1 : (data) =>{
		return new Promise( async function(resolve,reject){
			if(data.data.toLowerCase() == "yes, they can"){
				await sendExternalMessage(data, 'That’s a myth, So, ECPs won’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies,They do not cause abortion.')
			}
			else if(data.data.toLowerCase() == "no, wont work"){
				await sendExternalMessage(data, 'You’re right, ECPs don’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies, They do not cause abortion.')
			}
			else {
				reject(data)
			}
			delete data.stage
			resolve(data)
		})
	},

	q2 : (data) =>{
		return new Promise( async function(resolve,reject){
			if(data.data.toLowerCase() == "completely safe"){
				await sendExternalMessage(data, 'Correct, Evidence shows that ECPs do not cause birth defects, It does not harm the fetus (The developing baby) in any way.')
			}
			else if(data.data.toLowerCase() == "its not safe"){
				await sendExternalMessage(data, 'No, not really, Evidence shows that ECPs do not cause birth defects, It does not harm the fetus (The developing baby) in any way.')
			}
			else {
				reject(data)
			}
			delete data.stage
			resolve(data)
		})
	},

	q3 : (data) =>{
		return new Promise( async function(resolve,reject){
			if(data.data.toLowerCase() == "they are unsafe"){
				await sendExternalMessage(data, 'That\'s a myth, You see, as per research, individuals between the age of 13 to 16 years can use them safely.')
			}
			else if(data.data.toLowerCase() == "sure, they are"){
				await sendExternalMessage(data, 'You are right, As per research, individuals between the age of 13 to 16 years can use them safely.')
			}
			else {
				reject(data)
			}
			delete data.stage
			resolve(data)
		})
	},

}

// function sendExternalMessage(data, text) {
//    	let obj = {
//       	method: 'POST',
//     	url: 'http://localhost:8191/sendNotification',
//        	json: {
// 	    	text: text,
// 		    type: "text",
// 		    sender: data.sender,
// 		    language: "en",
// 		    projectId: 'srh_dev_184276895194'
// 		}
//    	}
//    	return runRequest(obj)
// }

// function runRequest(options){
// 	return new Promise(function(resolve,reject){
// 		request(options, function(error, response, body){
// 			if(error){
// 				reject(error)
// 			}
// 			resolve(body)
// 		})
// 	})
// }
