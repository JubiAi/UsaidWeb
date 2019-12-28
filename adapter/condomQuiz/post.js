var request = require('request')
var sendExternalMessage = require('../../external.js')

module.exports = {

	q1: (data) => {
		return new Promise(async function (resolve, reject) {
			if (data.data.toLowerCase() == "that should be okay") {
				// await sendExternalMessage(data, 'Incorrect! Condoms are made for one-time use only. |break|After each session, a fresh one must be used')
				data.tags.answer = false
			} else if (data.data.toLowerCase() == "no, that wont work") {
				// await sendExternalMessage(data, 'So, condoms are made for one-time use only. |break|After each session, a fresh one must be used')
				data.tags.answer = true
			} else {
				reject(data)
			}
			delete data.stage
			resolve(data)
		})
	},

	q2: (data) => {
		return new Promise(async function (resolve, reject) {
			if (data.data.toLowerCase() == "yes. thats true") {
				// await sendExternalMessage(data, 'Actually, that’s a myth. |break|Condoms do not have any such effects on men.')
				data.tags.answer = false
			} else if (data.data.toLowerCase() == "no, thats a myth") {
				// await sendExternalMessage(data, 'Correct! |break|Condoms do not have any such effects on men. |break|This is just a myth.')
				data.tags.answer = true
			} else {
				reject(data)
			}
			delete data.stage
			resolve(data)
		})
	},

	q3: (data) => {
		return new Promise(async function (resolve, reject) {
			if (data.data.toLowerCase() == "there is no use" || data.data.toLowerCase() == "its important") {
				await sendExternalMessage(data, 'Actually, most contraceptives do not provide protection against STIs. |break|Only condoms can provide all-round protection!')
				console.log("++++++++++")
			} else {
				reject(data)
			}
			delete data.stage
			resolve(data)
		})
	},

	q4: (data) => {
		return new Promise(async function (resolve, reject) {
			if (data.data.toLowerCase() == "yes" || data.data.toLowerCase() == "no") {
				//await sendExternalMessage(data, 'Actually, most contraceptives do not provide protection against STIs. |break|Only condoms can provide all-round protection!')
				console.log("++++++++++")
			} else {
				reject(data)
			}
			delete data.stage
			resolve(data)
		})
	},

	// q4 : async (data) =>{
	// 	if(data.data.toLowerCase() == "yes" || data.data.toLowerCase() == "no"){
	// 		await sendExternalMessage(data, 'Latex condoms may not suit people with latex allergies. So make sure to check that first. |break|If you do have a latex allergy, don’t worry, condoms are available in other materials like plastic as well.')
	// 	}
	// 	// else if(data.data.toLowerCase() == "no, that won't work"){
	// 	// 	await sendExternalMessage(data, 'So, condoms are made for one-time use only. After each session, a fresh one must be used! |break|Can condoms make a man infertile, weak or impotent?')
	// 	// }
	// 	delete data.stage
	// },

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
// 		    projectId: 'srh_901991706005'
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