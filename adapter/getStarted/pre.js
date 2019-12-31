var sendExternalMessage = require('../../external.js')
var request = require('request')
var relationship = "https://development.jubi.ai/usaidWeb/images/relationship.jpg"
var flatpills = "http://development.jubi.ai/usaidWeb/images/flatpills.jpg"
var maternity = "http://development.jubi.ai/usaidWeb/images/maternity.png"
var iucd = "http://development.jubi.ai/usaidWeb/images/iucd.jpg"
var body = "http://development.jubi.ai/usaidWeb/images/body_carousal.jpg"
var condom = "http://development.jubi.ai/usaidWeb/images/condom_carousal.jpg"
var ecp = "http://development.jubi.ai/usaidWeb/images/ecp_carousal.jpg"
var sendExternalMessage = require('../../external.js')


module.exports = {

	city: (data) => {
		return new Promise(function (resolve, reject) {
			if (data.tags.cityMatches && data.tags.cityMatches.length > 0) {
				let arr = []
				data.tags.cityMatches.forEach(function (element) {
					arr.push({
						data: element.target,
						text: element.target
					})
				})
				data.reply = {
					type: "quickReply",
					text: "Select from one of the below closest match",
					next: {
						data: arr
					}
				}
			} else if (data.tags.cityMatches && data.tags.cityMatches.length == 0) {
				data.reply = {
					type: 'text',
					text: 'No city could be found matching ' + data.tags.userSays + '. Could you be more specific?'
				}
			}
			resolve(data)
		})
	},

	carousalOne: (data) => {
		return new Promise((resolve, reject) => {
			console.log(data)
			console.log(data + "-----------------")
			data.reply = {
				type: 'generic',
				text: "Let's start off, then! |break|You can type your question below or select a topic from the given options to learn more!",
				next: {
					data: [{
							image: flatpills,
							title: "One of the most preferred birth control methods out there!",
							buttons: [{
								type: "text",
								text: "SELECT",
								data: "ocp"
							}]
						},
						{
							image: maternity,
							title: "Planning for the perfect family? Read on!",
							buttons: [{
								type: "text",
								text: "SELECT",
								data: "hstp"
							}]
						},
						{
							image: iucd,
							title: "Looking for a long term Birth control option? Check out the superstar IUDs",
							buttons: [{
								type: "text",
								text: "SELECT",
								data: "iucd-d"
							}]
						},
						{
							image: ecp,
							title: "Had Unprotected Sex? Know what to do now",
							buttons: [{
								type: "text",
								text: "SELECT",
								data: "ecpstart"
							}]
						},
						{
							image: condom,
							title: "Condoms: Your Best Freinds? Learn more about the all-rounder contraceptive",
							buttons: [{
								type: "text",
								text: "SELECT",
								data: "condomstart"
							}]
						},
						{
							image: body,
							title: "How does my body work? Your body is a wonderland. Learn more about it",
							buttons: [{
								type: "text",
								text: "SELECT",
								data: "bodystart"
							}]
						}
					]
				}
			}
			return resolve(data)
		})
	},

	underage: (data) => {
		return new Promise(async function (resolve, reject) {
			// delete data.tags.accepted
			data.reply = {
				type: "button",
				text: "According to our terms and conditions, you must be over 15 years to access Jubi. Read more here https://development.jubi.ai/usaidWeb/termsOfService.html",
				next: {
					data: [{
							type: "url",
							data: "https://development.jubi.ai/usaidWeb/policyPrivacy.html",
							text: "Privacy Policy"
						},
						{
							type: "url",
							data: "https://development.jubi.ai/usaidWeb/termsOfService.html",
							text: "Terms of Service"
						}
					]
				}
			}
			delete data.stage

			resolve(data)
		})
	},

	disclaimer: (data) => {
		return new Promise(async function (resolve, reject) {
			if (data.tags.rejected == true && data.tags.accepted == false) {
				delete data.tags.rejected
				await sendExternalMessage(data, 'According to our terms and conditions, you must be over 15 years to access Khushi Live. Read more here https://development.jubi.ai/usaidWeb/termsOfService.html')
				data.stage = "conAge"
			} 
			else if (data.tags.accepted == true && data.tags.rejected == false) {
				// delete data.tags.accepted
				data.reply = {
					type: "button",
					text: "Great! Btw everything we discuss here is absolutely private. Take a look at your privacy policy and terms of service below to know more. |break|To agree please click on “I agree” below.",
					next: {
						data: [{
								type: "url",
								data: "https://development.jubi.ai/usaidWeb/policyPrivacy.html",
								text: "Privacy Policy"
							},
							{
								type: "url",
								data: "https://development.jubi.ai/usaidWeb/termsOfService.html",
								text: "Terms of Service"
							},
							{
								data: 'main carousal',
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