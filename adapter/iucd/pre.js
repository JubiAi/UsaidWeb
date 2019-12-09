var relationship = "https://bot.jubi.ai/usaid/images/relationship.jpg";
var sendExternalMessage = require("../../external.js");
var request = require("request");

module.exports = {
  remove: model => {
    return new Promise(function (resolve) {
      model.reply = {
        type: "quickReply",
        text: "And the best part about IUCD’s is that you can change your mind about them anytime! A Doctor can get them removed for you whenever you decide so. Also, your ability to have babies (fertility) returns immediately after you remove your IUCD’s.",
        next: {
          data: [{
            data: "Tell me more about how they work?",
            text: "Tell me more about how they work?"
          }]
        }
      };
      //delete model.tags.answer1

      console.log(model.reply);
      return resolve(model);
    });
  },

  ut: model => {
    return new Promise(function (resolve) {
      model.reply = {
        type: "quickReply",
        text: " So, an IUCD is placed in your uterus by a doctor. There it does its job of preventing pregnancies day in and day out!",
        next: {
          data: [{
            data: "inside my uterus",
            text: "Inside my uterus! 😨 Does it hurt?"
          }]
        }
      };
      //delete model.tags.answer1

      console.log(model.reply);
      return resolve(model);
    });
  },
  manage: model => {
    return new Promise(function (resolve) {
      model.reply = {
        type: "quickReply",
        text: "It's different for different women. But yes, many do experience pain.|break| But the pain can be managed in a lot of ways!For most women resting for a short while after, helps.",
        next: {
          data: [{
              data: "worried",
              text: " Still worried? Talk to a counsellor"
            },

            {
              data: "iucd",
              text: "Tell me more about IUCD’s"
            }
          ]
        }
      };
      //delete model.tags.answer1

      console.log(model.reply);
      return resolve(model);
    });
  },

  hiucd: model => {
    return new Promise(function (resolve) {
      model.reply = {
        type: "quickReply",
        text: "Well IUCD’S come in two forms. Copper and Hormonal IUCD’s. |break|The copper IUCD works by bringing about a chemical change in the uterus. |break|This prevents pregnancy by damaging the sperm and egg before they can meet.",
        next: {
          data: [{
            data: "And what about hormonal IUCD’s",
            text: "And what about hormonal IUCD’s"
          }]
        }
      };
      //delete model.tags.answer1

      console.log(model.reply);
      return resolve(model);
    });
  },

  risk: model => {
    return new Promise(function (resolve) {
      model.reply = {
        type: "quickReply",
        text: "They work by releasing small amounts of hormones that prevent the sperm from fertilizing the egg.",
        next: {
          data: [{
            data: "Are there any risks of using IUCD’s?",
            text: "Are there any risks of using IUCD’s?"
          }]
        }
      };
      //delete model.tags.answer1

      console.log(model.reply);
      return resolve(model);
    });
  },








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

  q2: model => {
    return new Promise(function (resolve) {
      console.log("========================================================");
      console.log(model.tags.answer1);
      if (model.tags.answer1 == false) {
        console.log("++++++false++++++++");
        model.reply = {
          type: "quickReply",
          text: "This is actually a myth, my friend! You see, Oral contraceptive pills (OCPs) are only temporary forms of birth control. Within 1 to 3 months of stopping the pills, a woman’s fertility returns. |break|Next one, if you get pregnant when you are using these pills, your babies can have birth defects.",
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
          text: "Oh! That’s actually a myth.Even if a woman accidentally takes an OCP when she is pregnant, the baby will not be bornwith birth defects. OCPs do not harm the fetus or the baby. |break|Lastly, Any kind of OCP is not safe for breastfeeding mothers.",
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
          text: "True!Even if a woman accidentally takes an OCP when she is pregnant, the baby will not be born with birth defects. OCPs do not harm the fetus or the baby. |break|Lastly, Any kind of OCP is not safe for breastfeeding mothers.",
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



  final: model => {
    return new Promise(function (resolve) {
      console.log("========================================================");
      console.log(model.tags.answer3);
      if (model.tags.total == 3) {
        console.log("++++++false++++++++");
        model.reply = {
          type: "quickReply",
          text: "That's a myth. You see, IUCD’s usage does not affect breast milk adversely. Hence it's completely safe for a breastfeeding mother.Wow! You’ve learned a lot today. For more help with contraceptives, you can get in touch with our counselors.Got a query? you can type it in the text box below.Or you can continue with another topic by clicking on main menu!",
          next: {
            data: [{
                data: "startflow",
                text: "Main Menu"
              },
              {
                data: "Call helpline",
                text: "Talk to a IUCD counsellor"
              }
            ]
          }
        };
        //delete model.tags.answer1
      } else {
        model.reply = {
          type: "quickReply",
          text: "Correct! So, Non-hormonal and Progesterone (a certain type of hormone) only pills can be safely used by breastfeeding mothers! They don’t affect the breast milk adversely.I’m sure you have learned a lot about IUCDs by now. If you still have questions you can type it in the text box. You can also get in touch with our counselors.Or you can continue with another topic by clicking on main menu!",
          next: {
            data: [{
                data: "startflow",
                text: "Main Menu"
              },
              {
                data: "Call helpline",
                text: "Talk to a IUCD counsellor"
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



  q4: model => {
    return new Promise(function (resolve) {
      console.log("========================================================");
      console.log(model.tags.answer3);
      if (model.tags.total == 3) {
        console.log("++++++false++++++++");
        model.reply = {
          type: "quickReply",
          text: "That's a myth. You see, IUCD’s usage does not affect breast milk adversely. Hence it's completely safe for a breastfeeding mother.|break| Wow! You’ve learned a lot today. For more help with contraceptives, you can get in touch with our counselors.Got a query? you can type it in the text box below.",
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
                data: "Call helpline",
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