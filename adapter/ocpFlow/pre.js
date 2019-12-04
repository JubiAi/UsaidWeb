var relationship = "https://bot.jubi.ai/usaid/images/relationship.jpg"
var sendExternalMessage = require('../../external.js')
var request = require('request')

module.exports={

ocpintro: (data) => {
        return new Promise((resolve, reject) => {
            data.reply = {
                type: 'generic',
                text: "All done! Let's start?",
                next: {
                    data: [
                        {
                            image: relationship,
                            title: " The Highly effective Oral contraceptive pills (OCPs) are preferred by over 10 crore women across the world!",
                            buttons: [
                                {   
                                    type: "text",
                                    text: "Select"
                                }
                            ]
                        }
                    ]
                }
            }
            return resolve(data)
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
				await sendExternalMessage(data, 'According to our terms and conditions, you must be over 15 years to access Khushi Live. Read more here https://bot.jubi.ai/usaid/termsOfService.html')
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
                                data: "https://bot.jubi.ai/usaid/policyPrivacy.html",
                                text: "Privacy Policy"
	                        },
	                        {
	                            type: "url",
                                data: "https://bot.jubi.ai/usaid/termsOfService.html",
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