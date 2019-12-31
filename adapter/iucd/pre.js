module.exports={
	final : model=>{
		model.reply={
			type : "quickReply",
			text : "Wow! You’ve learned a lot today. For more help with contraceptives, you can get in touch with our counselors. Got a query? you can type it in the text box below. Or you can continue with another topic by clicking on main menu!",
			next : {
				data : [
					{
						data : 'main menu',
						text : 'Main Menu'
					}
				]
			}
		}
		return model
	}
}