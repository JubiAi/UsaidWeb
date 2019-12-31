module.exports={
    hstp: model => {
        console.log(model)
        if (model.tags.answer == false) {
            model.reply = {
                type: "quickReply",
                text: "Nice try, but the correct answer is 4 weeks. |break|Looks like you need to learn more about HTSP",
                next: {
                    data: [
                        {
                            data: "HTSP",
                            text: "What is HTSP?"
                        }
                    ]
                }
            };
        }
        else if (model.tags.answer == true) {
            model.reply = {
                type: "quickReply",
                text: "Correct! A woman becomes fertile as early as 4 weeks post-pregnancy. |break|You will learn this and more under  HTSP!",
                next: {
                    data: [
                        {
                            data: "HTSP",
                            text: "What is HTSP?"
                        }
                    ]
                }
            };
        }
        model.tags.answer = undefined
        return model;
    },

    q1: model => {
            model.reply = {
                type: "quickReply",
                text: "Here’s the first one...IUCD is the best method of spacing!",
                next: {
                    data: [
                        {
                          data: "correct",
                          text: "Correct"
                        },
                        {
                          data: "False",
                          text: "False"
                        }
                    ]
                }
            };
            return model;
    },

    q2: model => {
        if (model.tags.answer == false) {
            model.reply = {
                type: "quickReply",
                text: "Oh! That’s the wrong one. So, an IUCD is one of the best methods of spacing. Others include Centchroman pill (also known as chhaya), condoms, injectables (also known as Depo-provera), etc. But note! Only a trained health care specialist or doctor can help you choose the right method that will suit you.|break| Second myth buster…|break|Contraceptive pills (goli) can stop your ability to have kids",
                next: {
                    data: [
                        {
                            data: "Not Correct",
                            text: "Not Correct"
                        },
                        {
                            data: "Correct",
                            text: "Correct"
                        }
                    ]
                }
            };
        } 
        else if (model.tags.answer == true) {
            model.reply = {
                type: "quickReply",
                text: "You got it right! IUCD is just one of the many great methods of spacing. Others include Centchroman pill (also known as chhaya), condoms, injectables (also known as Depo-provera), etc.|break|However, no matter what the contraceptive, only a trained health care specialist or doctor can help <b>you pick the best method for YOU</b>|break| Second myth buster…|break|Contraceptive pills (goli) can stop your ability to have kids",
                next: {
                    data: [
                        {
                            data: "Not Correct",
                            text: "Not Correct"
                        },
                        {
                            data: "Correct",
                            text: "Correct"
                        }
                    ]
                }
            };
        }
        model.tags.answer = undefined
        return model;
    },

    q3: model => {
        if (model.tags.answer == true) {
            model.reply = {
                type: "quickReply",
                text: "Your answer is right! Oral contraceptive pills (OCPs) are temporary forms of birth control. Once a woman stops taking the pill, in 1 to 3 months her fertility (ability to have children) returns. |break|All done! Need more information on contraceptives? Contact our helpline by clicking on the button below. You can also directly type in your query in the text box below.",
                next: {
                    data: [
                        {
                            data: "helpline",
                            text: "Helpline"
                        },
                        {
                            data: "startflow",
                            text: "Learn More"
                        }
                    ]
                }
            };
        } 
        else if (model.tags.answer == false) {
            model.reply = {
                type: "quickReply",
                text: "That’s not correct! Let us learn. You see, Oral contraceptive pills (OCPs) are only temporary forms of birth control. In about 1 to 3 months of stopping the pills, a woman’s fertility (ability to have kids) returns.|break| All done!Need more information on contraceptives? Contact our helpline by clicking on the button below. You can also directly type in your query in the text box below.",
                next: {
                    data: [
                        {
                            data: "helpline",
                            text: "Helpline"
                        },
                        {
                            data: "startflow",
                            text: "Learn Something More"
                        }
                    ]
                }
            };
        }
        model.tags.answer = undefined
        return model;
    }
}