var relationship = "https://development.jubi.ai/usaidWeb/images/relationship.jpg"
var flatpills = "http://development.jubi.ai/usaidWeb/images/flatpills.jpg"
var maternity = "http://development.jubi.ai/usaidWeb/images/maternity.png"
var iucd = "http://development.jubi.ai/usaidWeb/images/iucd.jpg"
var body = "http://development.jubi.ai/usaidWeb/images/body_carousal.jpg"
var condom = "http://development.jubi.ai/usaidWeb/images/condom_carousal.jpg"
var ecp = "http://development.jubi.ai/usaidWeb/images/ecp_carousal.jpg"

module.exports={
	carousal: (data) => {
		data.reply = {
			type: 'generic',
			text: "Let's start off, then! |break|You can type your question below or select a topic from the given options to learn more!",
			next: {
				data:[
					{
						image: flatpills,
						title: "One of the most preferred birth control methods out there!",
						buttons: [
							{
								type: "text",
								text: "SELECT",
								data: "ocp"
							}
						]
					},
					{
						image: maternity,
						title: "Planning for the perfect family? Read on!",
						buttons: [
							{
								type: "text",
								text: "SELECT",
								data: "hstpQuiz"
							}
						]
					},
					{
						image: iucd,
						title: "Looking for a long term Birth control option? Check out the superstar IUDs",
						buttons: [
							{
								type: "text",
								text: "SELECT",
								data: "iucd-d"
							}
						]
					},
					{
						image: ecp,
						title: "Had Unprotected Sex? Know what to do now",
						buttons: [
							{
								type: "text",
								text: "SELECT",
								data: "ecpstart"
							}
						]
					},
					{
						image: condom,
						title: "Condoms: Your Best Freinds? Learn more about the all-rounder contraceptive",
						buttons: [
							{
								type: "text",
								text: "SELECT",
								data: "condomstart"
							}
						]
					},
					{
						image: body,
						title: "How does my body work? Your body is a wonderland. Learn more about it",
						buttons: [
							{
								type: "text",
								text: "SELECT",
								data: "bodystart"
							}
						]
					}
				]
			}
		}
		return data
	}
}