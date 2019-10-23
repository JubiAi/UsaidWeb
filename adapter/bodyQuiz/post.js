var request = require('request')
var sendExternalMessage = require('../../external.js')

module.exports={

	q1 : (data) =>{
		return new Promise( async function(resolve,reject){
			if(data.data.toLowerCase() == "you can get pregnant"){
				// await sendExternalMessage(data, 'Your right First time or any other time, having unprotected sex means high chances of pregnancy')
				data.tags.answer = true
			}
			else if(data.data.toLowerCase() == "you wont"){
				// await sendExternalMessage(data, 'First time or any other time, the only way you can have worry-free sex is by using contraceptives.')
				data.tags.answer = false
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
			if(data.data.toLowerCase() == "its possible"){
				// await sendExternalMessage(data, 'Indeed, it is possible to get pregnant during period days, But the chances are low in the first few days of periods, However, it’s never wise to take a chance, Use protection ☔')
				data.tags.answer = true
			}
			else if(data.data.toLowerCase() == "its not"){
				// await sendExternalMessage(data, 'The chances of getting pregnant during the first few days of periods are low, But it\'s not completely safe, So it\'s best to always use protection during sex ☔')
				data.tags.answer = false
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
			if(data.data.toLowerCase() == "its very effective"){
				// await sendExternalMessage(data, 'Frankly speaking, this method can be risky. |break|That\'s because even the pre-ejaculate (the clear fluid that comes out of the penis when it is hard) can contain sperm.')
				data.tags.answer = false
			}
			else if(data.data.toLowerCase() == "there is high risk"){
				// await sendExternalMessage(data, 'That\'s right. |break|Because the pre-ejaculate (the clear fluid that comes out of the penis when it is hard) can contain sperm, this method is high risk.')
				data.tags.answer = true
			}
			else {
				reject(data)
			}
			delete data.stage
			resolve(data)
		})
	},

}
