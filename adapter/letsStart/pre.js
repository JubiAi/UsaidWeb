var relationship = "https://development.jubi.ai/usaidWeb/images/relationship.jpg"
var sendExternalMessage = require('../../external.js')
var request = require('request')

module.exports = {

    carousalOne: (data) => {
        return new Promise((resolve, reject) => {
            data.reply = {
                type: 'generic',
                text: "All done! Let's start?",
                next: {
                    data: [{
                        image: relationship,
                        title: "Thinking about relationships? Here is what you need to know. Found your Raj/Anjali? Here is what you need to know",
                        buttons: [{
                            type: "text",
                            text: "Select"
                        }]
                    }]
                }
            }
            return resolve(data)
        })
    },

    carousalTwo: (data) => {
        return new Promise(async (resolve, reject) => {
            if (data.tags.accepted == true && data.tags.rejected == false) {
                if (data.tags.userSays == "Main menu" || data.tags.userSays == "go to the main menu" || data.tags.userSays == "main menu" || data.tags.userSays == "Go to the main menu" || data.tags.userSays == "talk to a counsellor...") {
                    data.reply = {
                        type: 'generic',
                        text: 'Pick a Topic from Below',
                        next: {
                            data: [{
                                    image: 'https://bot.jubi.ai/usaid/images/condom_carousal.jpg',
                                    title: "Condoms: Your best friends?",
                                    text: "Learn more about the all-rounder contraceptive.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "condomStart"
                                    }]
                                },
                                {
                                    image: 'https://bot.jubi.ai/usaid/images/ecp_carousal.jpg',
                                    title: "Had unprotected sex last night? ",
                                    text: "Know what to do now.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "ecpStart"
                                    }]
                                },
                                {
                                    image: 'https://bot.jubi.ai/usaid/images/body_carousal.jpg',
                                    title: "How does my body work?",
                                    text: "Your body is a wonderland. Learn more about it.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "bodyStart"
                                    }]
                                }
                            ]
                        }
                    }
                    return resolve(data)
                } else {
                    data.reply = {
                        type: 'generic',
                        text: "All done 😊 Pick a topic from below to learn more! |break|Throughout your journey, you can always access Cancel, Restart and other buttons from the menu on your bottom left.",
                        next: {
                            data: [{
                                    image: 'https://bot.jubi.ai/usaid/images/condom_carousal.jpg',
                                    title: "Condoms: Your best friends?",
                                    text: "Learn more about the all-rounder contraceptive.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "condomStart"
                                    }]
                                },
                                {
                                    image: 'https://bot.jubi.ai/usaid/images/ecp_carousal.jpg',
                                    title: "Had unprotected sex last night? ",
                                    text: "Know what to do now.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "ecpStart"
                                    }]
                                },
                                {
                                    image: 'https://bot.jubi.ai/usaid/images/body_carousal.jpg',
                                    title: "How does my body work?",
                                    text: "Your body is a wonderland. Learn more about it.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "bodyStart"
                                    }]
                                }
                            ]
                        }
                    }
                    return resolve(data)
                }
            } else if (data.tags.overfifteen == false) {
                delete data.tags.rejected
                delete data.tags.accepted
                await sendExternalMessage(data, 'According to our terms and conditions, you must be over 15 years to access Khushi Live. Read more here https://development.jubi.ai/usaidWeb/usaid/termsOfService.html')
                data.stage = "conAge"
                return resolve(data)
            } else if (data.tags.overfifteen == true) {
                if (data.tags.userSays == "Main menu" || data.tags.userSays == "go to the main menu" || data.tags.userSays == "main menu" || data.tags.userSays == "Go to the main menu" || data.tags.userSays == "talk to a counsellor...") {
                    data.reply = {
                        type: 'generic',
                        text: 'Pick a Topic from Below',
                        next: {
                            data: [{
                                    image: 'https://bot.jubi.ai/usaid/images/condom_carousal.jpg',
                                    title: "Condoms: Your best friends?",
                                    text: "Learn more about the all-rounder contraceptive.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "condomStart"
                                    }]
                                },
                                {
                                    image: 'https://bot.jubi.ai/usaid/images/ecp_carousal.jpg',
                                    title: "Had unprotected sex last night? ",
                                    text: "Know what to do now.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "ecpStart"
                                    }]
                                },
                                {
                                    image: 'https://bot.jubi.ai/usaid/images/body_carousal.jpg',
                                    title: "How does my body work?",
                                    text: "Your body is a wonderland. Learn more about it.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "bodyStart"
                                    }]
                                }
                            ]
                        }
                    }
                    return resolve(data)
                } else {
                    data.reply = {
                        type: 'generic',
                        text: "All done 😊 Pick a topic from below to learn more! |break|Throughout your journey, you can always access Cancel, Restart and other buttons from the menu on your bottom left.",
                        next: {
                            data: [{
                                    image: 'https://bot.jubi.ai/usaid/images/condom_carousal.jpg',
                                    title: "Condoms: Your best friends?",
                                    text: "Learn more about the all-rounder contraceptive.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "condomStart"
                                    }]
                                },
                                {
                                    image: 'https://bot.jubi.ai/usaid/images/ecp_carousal.jpg',
                                    title: "Had unprotected sex last night? ",
                                    text: "Know what to do now.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "ecpStart"
                                    }]
                                },
                                {
                                    image: 'https://bot.jubi.ai/usaid/images/body_carousal.jpg',
                                    title: "How does my body work?",
                                    text: "Your body is a wonderland. Learn more about it.",
                                    buttons: [{
                                        type: "text",
                                        text: "Select",
                                        data: "bodyStart"
                                    }]
                                }
                            ]
                        }
                    }
                    return resolve(data)
                }
            }
        })
    },

    talkToAgent: (data) => {
        console.log("+_+_+_+_+_+_+_+_+_+_")
        console.log(data.tags.userSays == "talk to a counsellor ☎")
        return new Promise(function (resolve) {
            if (data.tags.userSays.toLowerCase() == "talk to a counsellor") {
                data.reply = {
                    type: "button",
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a> between 9 AM and 5PM or |break|You can click on the button below to continue our conversation 😊',
                    next: {
                        data: [{
                                type: 'url',
                                data: 'http://www.buymecondom.com/',
                                text: 'Buy them chupkese?'
                            },
                            {
                                data: 'More questions...',
                                text: 'More questions...'
                            }
                        ]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays == "📞 a counsellor") {
                data.reply = {
                    type: "button",
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a> between 9 AM and 5PM or |break|You can click on the button below to continue our conversation 😊',
                    next: {
                        data: [ //changes done
                            {
                                data: 'ecptoget',
                                text: 'How to get ECPs?'
                            }
                        ]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays == "talk to counsellor") {
                data.reply = {
                    type: "button",
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a> between 9 AM and 5PM or |break|What would you like to do next?',
                    next: {
                        data: [{ //changes done
                                data: 'Main menu',
                                text: 'Main menu'
                            },
                            {
                                type: 'url',
                                data: 'http://www.buymecondom.com/',
                                text: 'Purchase condoms'
                            }
                        ]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays == 'helpline') {
                data.reply = {
                    type: "button",
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a> between 9 AM and 5PM OR |break|What would you like to do next?',
                    next: {
                        data: [{ //changes done
                            data: 'Main menu',
                            text: 'Main menu'
                        }]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays == "☎️") {
                data.reply = {
                    type: "quickReply", //changes done
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a> between 9 AM and 5PM or |break|You can click on the button below to continue our conversation 😊',
                    next: {
                        data: [{
                            data: 'Keep chatting',
                            text: 'Keep chatting'
                        }]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays == "🤙 a counsellor") {
                data.reply = { //changes done
                    type: "quickReply",
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a> between 9 AM and 5PM OR |break|You can click on the button below to continue our conversation 😊', //changes done
                    next: {
                        data: [{
                            data: 'Carry on chatting',
                            text: 'Carry on chatting'
                        }]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays.toLowerCase() == "Talk to a counsellor ☎" || data.tags.userSays.toLowerCase() == "talk to a counsellor ☎" || data.tags.userSays.toLowerCase() == "talk to a counsellor...") {
                console.log("-------------")
                data.reply = { //changes done
                    type: "button",
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a>  between 9 AM and 5PM OR ',
                    next: {
                        data: [{
                            data: 'Go to the main menu',
                            text: 'Go to the main menu'
                        }]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays.toLowerCase() == "Talk to a counsellor" || data.tags.userSays.toLowerCase() == "talk to a counsellor" || data.tags.userSays.toLowerCase().includes("talk to a counsellor")) {
                console.log("-------------")
                data.reply = { //changes done
                    type: "button",
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a> between 9 AM and 5PM OR ',
                    next: {
                        data: [{
                            data: 'Go to the main menu',
                            text: 'Go to the main menu'
                        }]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays.toLowerCase() == "restart") {
                console.log("-------------")
                data.reply = { //changes done
                    type: "button",
                    text: 'You can type your query below or Click on the below button to continue to main menu',
                    next: {
                        data: [{
                            data: 'Go to the main menu',
                            text: 'Go to the main menu'
                        }]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays == "call a counsellor📞") {
                data.reply = {
                    type: "button",
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a> between 9 AM and 5PM OR |break|Get information on the next steps after unprotected sex from the main menu below.',
                    next: {
                        data: [{ //changes done
                                data: 'Go to the main menu',
                                text: 'Go to the main menu'
                            },
                            {
                                type: 'url',
                                data: 'http://www.buymecondom.com/',
                                text: 'Purchase condoms'
                            }
                        ]
                    }
                }
                return resolve(data)
            } else if (data.tags.userSays == "Speak to a counsellor") {
                data.reply = { //changes done
                    type: "text",
                    text: 'Call us at <a href="tel:1-800-258-0001">1-800-258-0001</a> between 9AM and 5PM '
                }
                return resolve(data)
            }
        })
    }
}