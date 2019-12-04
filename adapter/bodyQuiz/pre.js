module.exports={
	bodyStart : (data) => {
        return new Promise(function(resolve,reject){
            if(data.tags.userSays.toLowerCase() == "bodystart"){
	            data.reply ={
	                type: "quickReply",
	                text: "Curious about your body, or someone else's? You’ve come to the right place! |break|What would you like to know about? |break|What does a normal penis look like? 🍆 |break|What does a normal vagina look like?🥑 |break|Is masturbation (self-pleasuring) harmful?🖐️",
	                next : {
	                    data : [
	                        {
	                            data : '🍆',
	                            text : '🍆'
	                        },
	                        {
	                            data : '🥑',
	                            text : '🥑'
	                        },
	                        {
	                            data : '🖐️',
	                            text : '🖐️'
	                        }
	                    ]
	                }                
	            }
	        }
	        else if(data.tags.userSays == "Previous questions"){
	        	data.reply ={
	                type: "quickReply",
	                text: "What would you like to know about? |break|What does a normal penis look like? 🍆 |break|What does a normal vagina look like?🥑 |break|Is masturbation (self-pleasuring) harmful?🖐️",
	                next : {
	                    data : [
	                        {
	                            data : '🍆',
	                            text : '🍆'
	                        },
	                        {
	                            data : '🥑',
	                            text : '🥑'
	                        },
	                        {
	                            data : '🖐️',
	                            text : '🖐️'
	                        }
	                    ]
	                }                
	            }
	        }
	        return resolve (data)
        })
    },

    q2 : (data) =>{
		return new Promise(function(resolve){
			console.log('========================================================')
			console.log(data.tags.answer)
			if (data.tags.answer == false){
				console.log("++++++false++++++++")
				data.reply ={
	                type: "quickReply",
	                text: "First time or any other time, the only way you can have worry-free sex is by using contraceptives. |break|Next one, You can’t get pregnant when you are on your period.",
	                next : {
	                    data : [
	                        {
	                            data : 'its possible',
	                            text : 'Its Possible'
	                        },
	                        {
	                            data : 'its not',
	                            text : 'Its not'
	                        }
	                    ]
	                }                
            	}
            delete data.tags.answer
			}
			else if(data.tags.answer == true){
				data.reply ={
	                type: "quickReply",
	                text: "Your right First time or any other time, having unprotected sex means high chances of pregnancy |break|Next one, You can’t get pregnant when you are on your period.",
	                next : {
	                    data : [
	                        {
	                            data : 'its possible',
	                            text : 'Its Possible'
	                        },
	                        {
	                            data : 'its not',
	                            text : 'Its not'
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
	                text: "The chances of getting pregnant during the first few days of periods are low, But it\'s not completely safe, So it\'s best to always use protection during sex ☔ |break|Moving on, Pulling out (withdrawal method) before sex can prevent pregnancy.",
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
	                text: "Indeed, it is possible to get pregnant during period days, But the chances are low in the first few days of periods, However, it’s never wise to take a chance, Use protection ☔ |break|Moving on, Pulling out (withdrawal method) before sex can prevent pregnancy.",
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
		console.log(data.reply)
		return resolve (data)
		})
	},

	q4: (data) =>{
		return new Promise(function(resolve){
			if(data.tags.answer == false){
				data.reply ={
	                type: "quickReply",
	                text: "Frankly speaking, this method can be risky. |break|That\'s because even the pre-ejaculate (the clear fluid that comes out of the penis when it is hard) can contain sperm. |break|Perfect! ${image::https://development.jubi.ai/usaidWeb/images/perfect.jpg}I think you now know the ins and outs of getting pregnant very well 😉.",
	                next : {
	                    data : [
	                        {
	                            data : 'cool!',
	                            text : 'Cool!'
	                        },
	                        {
	                            data : 'learn abt STIs🤒',
	                            text : 'Learn abt STIs🤒'
	                        }
	                    ]
	                }                
            	}
            delete data.tags.answer
			}
			else if(data.tags.answer == true){
				data.reply ={
	                type: "quickReply",
	                text: "That\'s right. |break|Because the pre-ejaculate (the clear fluid that comes out of the penis when it is hard) can contain sperm, this method is high risk. |break|Perfect! ${image::https://development.jubi.ai/usaidWeb/images/perfect.jpg}I think you now know the ins and outs of getting pregnant very well 😉.",
	                next : {
	                    data : [
	                        {
	                            data : 'cool!',
	                            text : 'Cool!'
	                        },
	                        {
	                            data : 'learn abt STIs🤒',
	                            text : 'Learn about STIs🤒'
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