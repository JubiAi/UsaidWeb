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


}