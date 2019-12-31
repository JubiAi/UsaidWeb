module.exports = {
	q1: (model) => {
		if (model.data.toLowerCase().includes("myth")) {
			model.tags.answer1 = false
			delete model.stage
		} 
		else if (model.data.toLowerCase().includes("fact")) {
			model.tags.answer1 = true
			delete model.stage
		}
		return model
	},

	q2: (model) => {
		if (model.data.toLowerCase().includes("myth")) {
			model.tags.answer2 = false
			delete model.stage
		} 
		else if (model.data.toLowerCase().includes("true")) {
			model.tags.answer2 = true
			delete model.stage
		}
		return model
	},

	q3: (model) => {
		if (model.data.toLowerCase().includes("not")) {
			model.tags.answer3 = false
			delete model.stage
		} 
		else if (model.data.toLowerCase().includes("true")) {
			model.tags.answer3 = true
			delete model.stage
		}
		return model
	}
}