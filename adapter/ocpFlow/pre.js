module.exports={
    q2: model => {
        if (model.tags.answer1 == false) {
            model.reply = {
                type: "quickReply",
                text: "Correct! Oral contraceptive pills (OCPs) are temporary forms of birth control. Once a woman stops taking the pill, within 1 to 3 months her fertility returns.|break|Next one, if you get pregnant when you are using these pills, your babies can have birth defects.",
                next: {
                    data: [
                        {
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
            return resolve(model);
        } 
        else if (model.tags.answer1 == true) {
            model.reply = {
                type: "quickReply",
                text: "This is actually a myth, my friend! You see, Oral contraceptive pills (OCPs) are only temporary forms of birth control. Within 1 to 3 months of stopping the pills, a woman’s fertility returns.|break| Next one, if you get pregnant when you are using these pills, your babies can have birth defects.",
                next: {
                    data: 
                    [
                        {
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
        }
        return model
    },
    
    q3: model => {
        if (model.tags.answer2 == false) {
            model.reply = {
                type: "quickReply",
                text: "True! Even if a woman accidentally takes an OCP when she is pregnant, the baby will not be born with birth defects. OCPs do not harm the fetus or the baby. |break|Lastly, Any kind of OCP is not safe for breastfeeding mothers.",
                next: {
                    data: 
                    [
                        {
                            data: "not",
                            text: "Not true"
                        },
                        {
                            data: "true",
                            text: "True"
                        }
                    ]
                }
            };
        } 
        else if (model.tags.answer2 == true) {
            model.reply = {
                type: "quickReply",
                text: "Oh! That’s actually a myth. Even if a woman accidentally takes an OCP when she is pregnant, the baby will not be bornwith birth defects. OCPs do not harm the fetus or the baby. |break|Lastly, Any kind of OCP is not safe for breastfeeding mothers.",
                next: {
                    data: 
                    [
                        {
                            data: "not",
                            text: "Not true"
                        },
                        {
                            data: "true",
                            text: "True"
                        }
                    ]
                }
            };
        }
        return model
    },
    
    q4: model => {
        if (model.tags.answer3 == false) {
            model.reply = {
                type: "quickReply",
                text: "Correct! So, Non-hormonal and Progesterone (a certain type of hormone) only pills can be safely used by breastfeeding mothers! They don’t affect the breast milk adversely.",
                next: {
                    data: 
                    [
                        {
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
        }
        else if (model.tags.answer3 == true) {
            model.reply = {
                type: "quickReply",
                text: "Uh-oh, Wrong answer! Non-hormonal and Progesterone (a certain type of hormone) only pills can be safely used by breastfeeding mothers! They don’t affect the breast milk adversely. Done! I’m sure you’ve learnt something new.To learn more click on the button below. You can also type in your query in the text box below!",
                next: {
                    data: 
                    [
                        {
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
        }
        return model
    }
}