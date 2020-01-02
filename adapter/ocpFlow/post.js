module.exports = {
	q1: (model) => {
		if (model.data.toLowerCase().includes("myth")) {
			model.tags.answer = undefined
			model.tags.answer = true
			delete model.stage
		} 
		else if (model.data.toLowerCase().includes("fact")) {
			model.tags.answer = undefined
			model.tags.answer = false
			delete model.stage
		}
		return model
	},

	q2: (model) => {
		if (model.data.toLowerCase().includes("myth")) {
			model.tags.answer = undefined
			model.tags.answer = true
			delete model.stage
		} 
		else if (model.data.toLowerCase().includes("true")) {
			model.tags.answer = undefined
			model.tags.answer = false
			delete model.stage
		}
		return model
	},

	q3: (model) => {
		if (model.data.toLowerCase().includes("not")) {
			model.tags.answer = undefined
			model.tags.answer = true
			delete model.stage
		} 
		else if (model.data.toLowerCase().includes("true")) {
			model.tags.answer = undefined
			model.tags.answer = false
			delete model.stage
		}
		return model
	}
}