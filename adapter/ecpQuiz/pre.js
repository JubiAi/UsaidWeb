module.exports={

	q2 : (data) =>{
		return new Promise(function(resolve){
			console.log('========================================================')
			console.log(data.tags.answer)
			if (data.tags.answer == false){
				console.log("++++++false++++++++")
				data.reply ={
	                type: "quickReply",
	                text: "That’s a myth, So, ECPs won’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies,They do not cause abortion. |break|Up next, If a woman takes an ECP when she is pregnant, will the baby be born with birth defects?",
	                next : {
	                    data : [
	                        {
	                            data : 'completely safe',
	                            text : 'Completely safe'
	                        },
	                        {
	                            data : 'its not safe',
	                            text : 'Its not safe'
	                        }
	                    ]
	                }                
            	}
            delete data.tags.answer
			}
			else if(data.tags.answer == true){
				data.reply ={
	                type: "quickReply",
	                text: "You’re right, ECPs don’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies, They do not cause abortion. |break|Up next, If a woman takes an ECP when she is pregnant, will the baby be born with birth defects?",
	                next : {
	                    data : [
	                        {
	                            data : 'completely safe',
	                            text : 'Completely safe'
	                        },
	                        {
	                            data : 'its not safe',
	                            text : 'Its not safe'
	                        }
	                    ]
	                }                
            	}
            delete data.tags.answer
			}
		console.log(data.reply)
		return resolve (data)
		})
	},

	q3 : (data) =>{
		return new Promise(function(resolve){
			console.log(data.tags.answer)
			if(data.tags.answer == false){
				data.reply ={
	                type: "quickReply",
	                text: "No, not really, Evidence shows that ECPs do not cause birth defects, It does not harm the fetus (The developing baby) in any way. |break|One more to go, Are ECPs safe for teenagers?",
	                next : {
	                    data : [
	                        {
	                            data : 'they are unsafe',
	                            text : 'They are unsafe'
	                        },
	                        {
	                            data : 'sure, they are',
	                            text : 'Sure, they are'
	                        }
	                    ]
	                }                
            	}
            delete data.tags.answer
			}
			else if(data.tags.answer == true){
				data.reply ={
	                type: "quickReply",
	                text: "Correct, Evidence shows that ECPs do not cause birth defects, It does not harm the fetus (The developing baby) in any way. |break|One more to go, Are ECPs safe for teenagers?",
	                next : {
	                    data : [
	                        {
	                            data : 'they are unsafe',
	                            text : 'They are unsafe'
	                        },
	                        {
	                            data : 'sure, they are',
	                            text : 'Sure, they are'
	                        }
	                    ]
	                }                 
            	}
            delete data.tags.answer
			}
		console.log(data.reply)
		return resolve (data)
		})
	},

	q4: (data) =>{
		return new Promise(function(resolve){
			if(data.tags.answer == false){
				data.reply ={
	                type: "quickReply",
	                text: "That\'s a myth, You see, as per research, individuals between the age of 13 to 16 years can use them safely. |break|Looks like our journey with ECPs have come to an end${image::https://development.jubi.ai/usaid/images/wow.jpg} You are now well informed about all things Emergency Contraceptive Pill. |break|Want to learn more? Pick another topic or you can get in touch with a counsellor.",
	                next : {
	                    data : [
	                        {
	                            data : 'its very effective',
	                            text : 'Its very effective'
	                        },
	                        {
	                            data : 'there is high risk',
	                            text : 'There is High risk'
	                        }
	                    ]
	                }                
            	}
            delete data.tags.answer
			}
			else if(data.tags.answer == true){
				data.reply ={
	                type: "quickReply",
	                text: "You are right, As per research, individuals between the age of 13 to 16 years can use them safely. |break|Looks like our journey with ECPs have come to an end${image::https://development.jubi.ai/usaid/images/wow.jpg} You are now well informed about all things Emergency Contraceptive Pill. |break|Want to learn more? Pick another topic or you can get in touch with a counsellor.",
	                next : {
	                    data : [
	                        {
	                            data : 'go to main menu',
	                            text : 'Go to Main Menu'
	                        },
	                        {
	                            data : 'talk to a counsellor ☎',
	                            text : 'Talk to a counsellor ☎'
	                        }
	                    ]
	                }                 
            	}
            delete data.tags.answer
			}
        console.log(data.reply)
		return resolve (data)
		})
	}

}