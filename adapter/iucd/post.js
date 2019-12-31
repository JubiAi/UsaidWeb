module.exports={
	q1: model => {
		if (model.data.toLowerCase().includes("right")) {
			delete model.stage;
		} 
		else if(model.data.toLowerCase().includes("no")) {
			delete model.stage;
		}
		return model;
	},
	
	q2: model => {
		if (model.data.toLowerCase().includes("true")) {
			delete model.stage;
		} 
		else if(model.data.toLowerCase().includes("no")){
			delete model.stage;
		}
		return model;
	},

	q3: model => {
		if (model.data.toLowerCase().includes("agree")) {
			delete model.stage;
		} 
		else if(model.data.toLowerCase().includes("nah")){
			delete model.stage;
		}
		return model;
	}
}