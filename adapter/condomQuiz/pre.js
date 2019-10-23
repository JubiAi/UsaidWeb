

module.exports={

	q2 : (data) =>{
		return new Promise(function(resolve){
			console.log('========================================================')
			console.log(data.tags.answer)
			if (data.tags.answer == false){
				console.log("++++++false++++++++")
				data.reply ={
	                type: "quickReply",
	                text: "Incorrect! Condoms are made for one-time use only. |break|After each session, a fresh one must be used |break|Next! |break|Can condoms make a man infertile, weak or impotent?",
	                next : {
	                    data : [
	                        {
	                            data : 'yes. thats true',
	                            text : 'Yes. Thats true'
	                        },
	                        {
	                            data : 'no, thats a myth',
	                            text : 'No, thats a myth'
	                        }
	                    ]
	                }                
            	}
            delete data.tags.answer
			}
			else if(data.tags.answer == true){
				data.reply ={
	                type: "quickReply",
	                text: "So, condoms are made for one-time use only. |break|After each session, a fresh one must be used |break|Next! |break|Can condoms make a man infertile, weak or impotent?",
	                next : {
	                    data : [
	                        {
	                            data : 'yes. thats true',
	                            text : 'Yes. Thats true'
	                        },
	                        {
	                            data : 'no, thats a myth',
	                            text : 'No, thats a myth'
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
	                text: "Actually, that’s a myth. |break|Condoms do not have any such effects on men. |break|Moving on. |break|Women on birth control (pills, etc) don’t need to use condoms.",
	                next : {
	                    data : [
	                        {
	                            data : 'there is no use',
	                            text : 'There is no use'
	                        },
	                        {
	                            data : 'its important',
	                            text : 'Its important'
	                        }
	                    ]
	                }                
            	}
            delete data.tags.answer
			}
			else if(data.tags.answer == true){
				data.reply ={
	                type: "quickReply",
	                text: "Correct! |break|Condoms do not have any such effects on men. |break|This is just a myth. |break|Moving on. |break|Women on birth control (pills, etc) don’t need to use condoms.",
	                next : {
	                    data : [
	                        {
	                            data : 'there is no use',
	                            text : 'There is no use'
	                        },
	                        {
	                            data : 'its important',
	                            text : 'Its important'
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
			data.reply ={
                type: "quickReply",
                text: "Actually, most contraceptives do not provide protection against STIs. |break|Only condoms can provide all-round protection! |break|Condoms can be used by everyone",
                next : {
                    data : [
                        {
                            data : 'yes',
                            text : 'Yes'
                        },
                        {
                            data : 'no',
                            text : 'No'
                        }

                    ]
                }                
        	}
        console.log(data.reply)
		return resolve (data)
		})
	}


}