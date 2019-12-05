var relationship = "https://bot.jubi.ai/usaid/images/relationship.jpg"
var sendExternalMessage = require('../../external.js')
var request = require('request')

module.exports = {

	hstp: (model) => {
		return new Promise(function (resolve) {
			console.log('========================================================')
			console.log(model.tags.answer1)
			if (model.tags.answer1 == false) {
				console.log("++++++false++++++++")
				model.reply = {
					type: "quickReply",
					text: "Nice try, but the correct answer is 4 weeks. |break|Looks like you need to learn more about HTSP",
					next: {
						data: [{
								data: 'HTSP',
								text: 'What is HTSP? '
							}

						]
					}
				}
				//delete model.tags.answer1
			} else if (model.tags.answer1 == true) {
				model.reply = {
					type: "quickReply",
					text: "Correct! A woman becomes fertile as early as 4 weeks post-pregnancy. |break|You will learn this and more under  HTSP!",
					next: {
						data: [{
								data: 'HTSP',
								text: 'What is HTSP? '
							}

						]
					}
				}
				//delete model.tags.answer1
			}
			console.log(model.reply)
			return resolve(model)
		})
	},
	hstphow: (model) => {
		return new Promise(function (resolve) {
			console.log('---------------------------HSTPHOW-----------------')
			model.reply = {
				type: "quickReply",
				text: "Healthy Timing and Spacing of Pregnancy (HTSP) is all about the safety and health of the mother and the child.",
				next: {
					data: [{
							data: 'how so',
							text: 'How so? '
						}

					]
				}
			}
			//delete model.tags.answer1

			console.log(model.reply)
			return resolve(model)
		})
	},

	time: (model) => {
		return new Promise(function (resolve) {
			console.log('---------------------------Time-----------------')
			model.reply = {
				type: "quickReply",
				text: "Did you know that 18-34 is the healthiest and the most fertile period in a woman's life? |break|Smart couples ensure that their kids are born during this period because it reduces the riskof complications. |break|Similarly, it’s wise to keep a gap of 3-5 years between your first and second child. |break|'${image::' + model.tags.happyfamily_image + '}' ",
				next: {
					data: [{
							data: 'Is that correct',
							text: 'Is that correct '
						}

					]
				}
			}
			//delete model.tags.answer1

			console.log(model.reply)
			return resolve(model)
		})
	},

	mother: (model) => {
		return new Promise(function (resolve) {
			console.log('---------------------------Mother-----------------')
			model.reply = {
				type: "quickReply",
				text: "Yes! This time helps the mother to rest and regain her health while the first child gets all the love and attention he/she requires from mummy. ❤️ |break|'${image::' + model.tags.motherchild_image + '}' Now, how about a myth buster to learn more about HTSP?",
				next: {
					data: [{
							data: "Lets start",
							text: "Let's start"
						}

					]
				}
			}
			console.log(model.reply)
			return resolve(model)
		})
	},


	q1: (model) => {
		return new Promise(function (resolve) {
			console.log('------------------------------------------------------q1----------------------')
			model.reply = {
				type: "quickReply",
				text: "Here’s the first one...IUCD is the best method of spacing!",
				next: {
					data: [{
							data: 'correct',
							text: 'Correct'
						},
						{
							data: 'False',
							text: 'False'
						}
					]
				}
			}
			console.log(model.reply)
			return resolve(model)
		})
	},


	q2: (model) => {
		return new Promise(function (resolve) {
			console.log('========================================================')
			console.log(model.tags.answern1)
			if (model.tags.answern1 == false) {
				console.log("-------------------false--------------")
				model.reply = {
					type: "quickReply",
					text: "Oh! That’s the wrong one. So, an IUCD is one of the best methods of spacing. Others include Centchroman pill (also known as chhaya), condoms, injectables (also known as Depo-provera), etc. But note! Only a trained health care specialist or doctor can help you choose the right method that will suit you.|break| Second myth buster…|break|Contraceptive pills (goli) can stop your ability to have kids",
					next: {
						data: [{
								data: 'Not Correct',
								text: 'Not Correct'
							},
							{
								data: 'Correct',
								text: 'Correct'
							}
						]
					}
				}

			} else if (model.tags.answern1 == true) {
				model.reply = {
					type: "quickReply",
					text: "You got it right! IUCD is just one of the many great methods of spacing. Others include Centchroman pill (also known as chhaya), condoms, injectables (also known as Depo-provera), etc.|break|However, no matter what the contraceptive, only a trained health care specialist ordoctor can help <b>you pick the best method for YOU</b>|break| Second myth buster…|break|Contraceptive pills (goli) can stop your ability to have kids",
					next: {
						data: [{
								data: 'Not Correct',
								text: 'Not Correct'
							},
							{
								data: 'Correct',
								text: 'Correct'
							}
						]
					}
				}

			}
			console.log(model.reply)
			return resolve(model)
		})
	},

	q3: (model) => {
		return new Promise(function (resolve) {
			console.log('========================================================')
			console.log(model.tags.answern2)
			if (model.tags.answern2 == false) {
				console.log("-------------------false--------------")
				model.reply = {
					type: "quickReply",
					text: "Your answer is right! Oral contraceptive pills (OCPs) are temporary forms of birth control. Once a woman stops taking the pill, in 1 to 3 months her fertility (ability to have children) returns. |break|All done!Need more information on contraceptives? Contact our helpline by clicking on the button below. You can also directly type in your query in the text box below.",
					next: {
						data: [{
								data: 'Helpline',
								text: 'Helpline'
							},
							{
								data: 'Learn More',
								text: 'Learn More'
							}
						]
					}
				}
				//delete model.tags.answer1
			} else if (model.tags.answern2 == true) {
				model.reply = {
					type: "quickReply",
					text: "That’s not correct! Let’s learn. You see, Oral contraceptive pills (OCPs) are only temporary forms of birth control. In about 1 to 3 months of stopping the pills, a woman’s fertility (ability to have kids) returns.|break|All done!Need more information on contraceptives? Contact our helpline by clicking on the button below. You can also directly type in your query in the text box below.",
					next: {
						data: [{
								data: 'Helpline',
								text: 'Helpline'
							},
							{
								data: 'Learn More',
								text: 'Learn More'
							}
						]
					}
				}
				//delete model.tags.answer1
			}
			console.log(model.reply)
			return resolve(model)
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

	disclaimer: (data) => {
		return new Promise(async function (resolve, reject) {
			if (data.tags.rejected == true && data.tags.accepted == false) {
				delete data.tags.rejected
				await sendExternalMessage(data, 'According to our terms and conditions, you must be over 15 years to access Khushi Live. Read more here https://bot.jubi.ai/usaid/termsOfService.html')
				data.stage = "conAge"
			} else if (data.tags.accepted == true && data.tags.rejected == false) {
				// delete data.tags.accepted
				data.reply = {
					type: "button",
					text: "Great! Btw everything we discuss here is absolutely private. Take a look at your privacy policy and terms of service below to know more. |break|To agree please click on “I agree” below.",
					next: {
						data: [{
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
								data: 'I agree',
								text: 'I agree'
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