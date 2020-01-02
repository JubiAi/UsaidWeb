module.exports={
	hstp: model => {
		if (model.data.toLowerCase().includes("4 weeks")) {
        	model.tags.answer = true;
	        delete model.stage;
	    } 
      	else {
	        model.tags.answer = false;
	        delete model.stage;
      	}
	    return model;
  	},

	q1: model => {
    	if (model.data.toLowerCase().includes("correct")) {
			model.tags.answer = undefined
        	model.tags.answer = false;
    		delete model.stage
      	} 
      	else if (model.data.toLowerCase().includes("false")) {
        	model.tags.answer = undefined
        	model.tags.answer = true;
      		delete model.stage
      	}
      	return model
    },

	q2: model => {
	    if (model.data.toLowerCase().includes("not correct")) {
			model.tags.answer = undefined
	        model.tags.answer = true;
	      	delete model.stage;
	    } 
	    else if (model.data.toLowerCase().includes("correct")) {
	        model.tags.answer = undefined
	        model.tags.answer = false;
	    	delete model.stage
	    }
	    return model;
	}
}