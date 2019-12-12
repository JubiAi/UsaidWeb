var relationship = "https://bot.jubi.ai/usaid/images/relationship.jpg";
var sendExternalMessage = require("../../external.js");
var request = require("request");

module.exports = {
  ocpintro: data => {
    return new Promise((resolve, reject) => {
      data.reply = {
        type: "generic",
        text: "All done! Let's start?",
        next: {
          data: [{
            image: relationship,
            title: " The Highly effective Oral contraceptive pills (OCPs) are preferred by over 10 crore women across the world!",
            buttons: [{
              type: "text",
              text: "Select"
            }]
          }]
        }
      };
      return resolve(data);
    });
  },

  q1: model => {
    return new Promise(function (resolve) {
      console.log("========================================================");
      model.reply = {
        type: "quickReply",
        text: "Alright! I will share a few statements and you will have to tell me if it is a myth or a fact. Let’s start.|break|Here’s your first one!|break|OCPs affect women’s fertility (ability to have children)",
        next: {
          data: [{
              data: "This is a myth",
              text: "This is a myth"
            },
            {
              data: "Its a fact",
              text: "It is a fact"
            }
          ]
        }
      };
      //delete model.tags.answer1

      console.log(model.reply);
      return resolve(model);
    });
  },

  q2: model => {
    return new Promise(function (resolve) {
      console.log("========================================================");
      console.log(model.tags.answer1);
      if (model.tags.answer1 == false) {
        console.log("++++++false++++++++");
        model.reply = {
          type: "quickReply",
          text: "This is actually a myth, my friend! You see, Oral contraceptive pills (OCPs) are only temporary forms of birth control. Within 1 to 3 months of stopping the pills, a woman’s fertility returns.|break| Next one, if you get pregnant when you are using these pills, your babies can have birth defects.",
          next: {
            data: [{
                data: "A myth",
                text: "A myth"
              },
              {
                data: "This is true",
                text: "This is true"
              }
            ]
          }
        };
        //delete model.tags.answer1
      } else if (model.tags.answer1 == true) {
        model.reply = {
          type: "quickReply",
          text: "Correct! Oral contraceptive pills (OCPs) are temporary forms of birth control. Once a woman stops taking the pill, within 1 to 3 months her fertility returns.|break|Next one, if you get pregnant when you are using these pills, your babies can have birth defects.",
          next: {
            data: [{
                data: "A myth",
                text: "A myth"
              },
              {
                data: "This is true",
                text: "This is true"
              }
            ]
          }
        };
        //delete model.tags.answer1
      }
      console.log(model.reply);
      return resolve(model);
    });
  },

  q3: model => {
    return new Promise(function (resolve) {
      console.log("========================================================");
      console.log(model.tags.answer1);
      if (model.tags.answer2 == false) {
        console.log("++++++false++++++++");
        model.reply = {
          type: "quickReply",
          text: "Oh! That’s actually a myth. Even if a woman accidentally takes an OCP when she is pregnant, the baby will not be bornwith birth defects. OCPs do not harm the fetus or the baby. |break|Lastly, Any kind of OCP is not safe for breastfeeding mothers.",
          next: {
            data: [{
                data: "A myth",
                text: "A myth"
              },
              {
                data: "This is true",
                text: "This is true"
              }
            ]
          }
        };
        //delete model.tags.answer1
      } else if (model.tags.answer2 == true) {
        model.reply = {
          type: "quickReply",
          text: "True! Even if a woman accidentally takes an OCP when she is pregnant, the baby will not be born with birth defects. OCPs do not harm the fetus or the baby. |break|Lastly, Any kind of OCP is not safe for breastfeeding mothers.",
          next: {
            data: [{
                data: "Not true",
                text: "Not true"
              },
              {
                data: "true",
                text: "True"
              }
            ]
          }
        };
        //delete model.tags.answer1
      }
      console.log(model.reply);
      return resolve(model);
    });
  },

  helpline: (data) => {
    return new Promise((resolve, reject) => {
      data.reply = {
        type: "button",
        text: '<a href="tel:1-800-258-0001">1-800-258-0001</a> OR |break|You can click on the button below to continue our conversation 😊',
        next: {
          data: [{
            data: "startflow",
            text: "Learn More"
          }]
        }
      }
      return resolve(data)
    })
  },

  q4: model => {
    return new Promise(function (resolve) {
      console.log("========================================================");
      console.log(model.tags.answer3);
      if (model.tags.answer3 == false) {
        console.log("++++++false++++++++");
        model.reply = {
          type: "quickReply",
          text: "Uh-oh, Wrong answer! Non-hormonal and Progesterone (a certain type of hormone) only pills can be safely used by breastfeeding mothers! They don’t affect the breast milk adversely. Done! I’m sure you’ve learnt something new.To learn more click on the button below. You can also type in your query in the text box below!",
          next: {
            data: [{
                data: "startflow",
                text: "Main Topics"
              },
              {
                data: "call helpline",
                text: "Call helpline"
              }
            ]
          }
        };
        //delete model.tags.answer1
      } else if (model.tags.answer3 == true) {
        model.reply = {
          type: "quickReply",
          text: "Correct! So, Non-hormonal and Progesterone (a certain type of hormone) only pills can be safely used by breastfeeding mothers! They don’t affect the breast milk adversely.",
          next: {
            data: [{
                data: "startflow",
                text: "Main Topics"
              },
              {
                data: "call helpline",
                text: "Call helpline"
              }
            ]
          }
        };
        //delete model.tags.answer1
      }
      console.log(model.reply);
      return resolve(model);
    });
  },








  talkToAgent: (data) => {
    console.log("+_+_+_+_+_+_+_+_+_+_")
    console.log(data.tags.userSays == "talk to a counsellor ☎")
    return new Promise(function (resolve) {
      if (data.tags.userSays.toLowerCase() == "talk to a counsellor") {
        data.reply = {
          type: "button",
          text: '<a href="tel:1-800-258-0001">1-800-258-0001</a> OR |break|You can click on the button below to continue our conversation 😊',
          next: {
            data: [ //changes done
              {
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
          text: '<a href="tel:1-800-258-0001">1-800-258-0001</a> or |break|You can click on the button below to continue our conversation 😊',
          next: {
            data: [ //changes done
              {
                data: 'How to get ECPs?',
                text: 'How to get ECPs?'
              }
            ]
          }
        }
        return resolve(data)
      } else if (data.tags.userSays == "talk to counsellor") {
        data.reply = {
          type: "button",
          text: '<a href="tel:1-800-258-0001">1-800-258-0001</a> OR |break|What would you like to do next?',
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
      } else if (data.tags.userSays == "☎️") {
        data.reply = {
          type: "quickReply", //changes done
          text: '<a href="tel:1-800-258-0001">1-800-258-0001</a> OR |break|You can click on the button below to continue our conversation 😊',
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
          text: '<a href="tel:1-800-258-0001">1-800-258-0001</a> OR |break|You can click on the button below to continue our conversation 😊', //changes done
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
          text: '<a href="tel:1-800-258-0001">1-800-258-0001</a>',
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
          text: '<a href="tel:1-800-258-0001">1-800-258-0001</a> OR |break|Get information on the next steps after unprotected sex from the main menu below.',
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
          text: '<a href="tel:1-800-258-0001">1-800-258-0001</a>'
        }
        return resolve(data)
      }
    })
  },







  //-------------------------------------------------------------------------------------------------------------------//







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

  disclaimer: data => {
    return new Promise(async function (resolve, reject) {
      if (data.tags.rejected == true && data.tags.accepted == false) {
        delete data.tags.rejected;
        await sendExternalMessage(
          data,
          "According to our terms and conditions, you must be over 15 years to access Khushi Live. Read more here https://bot.jubi.ai/usaid/termsOfService.html"
        );
        data.stage = "conAge";
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
                data: "I agree",
                text: "I agree"
              }
            ]
          }
        };
        delete data.stage;
      }
      resolve(data);
    });
  }
};