var sendExternalMessage = require('../../external.js')
var request = require('request')

module.exports={

	city :(data) =>{
		return new Promise(function(resolve, reject){
			if(data.tags.cityMatches && data.tags.cityMatches.length > 0){
				let arr = []
				data.tags.cityMatches.forEach(function(element){
					arr.push({
						data : element.target,
						text : element.target
					})
				})
				data.reply={
					type : "quickReply",
					text : "Select from one of the below closest match",
					next : {
						data : arr
					}
				}
			}
			else if(data.tags.cityMatches && data.tags.cityMatches.length == 0){
				data.reply={
					type : 'text',
					text : 'No city could be found matching '+data.tags.userSays+'. Could you be more specific?'
				}
			}
			resolve(data)
		})
	},

	// city :(data) =>{
	// 	data.reply={
	// 		type : "quickReply",
	// 		text: "Click on button below to enter location",
	// 		next: {
	// 			data : [
	// 				{
	// 					type : "location",
	// 					data : "select",
	// 					text : "select"
	// 				}
	// 			]
	// 		}
	// 	}
	// 	return data
	// },

	disclaimer:(data)=>{
		return new Promise(async function(resolve,reject){
			if(data.tags.rejected == true && data.tags.accepted == false){
				delete data.tags.rejected
				await sendExternalMessage(data, 'According to our terms and conditions, you must be over 15 years to access Khushi Live. Read more here https://development.jubi.ai/usaid/termsOfService.html')
				data.stage = "conAge"
			}
			else if(data.tags.accepted == true && data.tags.rejected == false){
				// delete data.tags.accepted
				data.reply={
					type : "button",
					text : "Great! Btw everything we discuss here is absolutely private. Take a look at your privacy policy and terms of service below to know more. |break|To agree please click on “I agree” below.",
					next : {
	                    data : [
	                    	{
	                            type: "url",
                                data: "https://development.jubi.ai/usaid/policyPrivacy.html",
                                text: "Privacy Policy"
	                        },
	                        {
	                            type: "url",
                                data: "https://development.jubi.ai/usaid/termsOfService.html",
                                text: "Terms of Service"
	                        },
	                        {
	                            data : 'I agree',
	                            text : 'I agree'
	                        }
	                    ]
                	}
				}
				delete data.stage
			}
		resolve(data)
		})
	}
}