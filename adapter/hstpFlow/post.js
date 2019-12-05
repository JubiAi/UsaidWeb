var cities = require("../../cities.json");
var stringSimilarity = require("string-similarity");
var sortBy = require("sort-by");
var sendExternalMessage = require("../../external.js");
var request = require("request");

module.exports = {
	maternity: model => {
		return new Promise(function (resolve, reject) {
			console.log(model.data);
			if (model.data.toLowerCase().includes("4 weeks")) {
				model.tags.answer1 = true
				delete model.stage;
				return resolve(model);
			} else {
				model.tags.answer1 = false
				delete model.stage;
				return resolve(model);
			}
		});
	},

	hstp: model => {
		return new Promise(function (resolve, reject) {
			console.log(model.data);
			if (model.data.toLowerCase().includes("htsp")) {
				delete model.stage;
				return resolve(model);
			} else {
				console.log("-------------Rejectfor hstp -----------");
				return reject(model);
			}
		});
	},

	hstphow: model => {
		return new Promise(function (resolve, reject) {
			console.log(model.data);
			if (model.data.toLowerCase().includes("how")) {
				model.tags.happyfamily_image = "http://development.jubi.ai/usaidWeb/images/happyfamily.jpg"
				delete model.stage;
				return resolve(model);
			} else {
				console.log("-------------Rejectfor hstphow-----------");
				return reject(model);
			}
		});
	},

	time: model => {
		return new Promise(function (resolve, reject) {
			console.log(model.data);
			if (model.data.toLowerCase().includes("correct")) {
				model.tags.motherchild_image = "http://development.jubi.ai/usaidWeb/images/motherchild.jpg"
				delete model.stage;
				return resolve(model);
			} else {
				console.log("-------------Rejectfor hstphow-----------");
				return reject(model);
			}
		});
	},

	mother: model => {
		return new Promise(function (resolve, reject) {
			console.log(model.data);
			if (model.data.toLowerCase().includes("start")) {
				delete model.stage;
				return resolve(model);
			} else {
				console.log("-------------Rejectfor hstphow-----------");
				return reject(model);
			}
		});
	},

	ocp: model => {
		return new Promise(function (resolve, reject) {
			console.log(model.data);
			if (model.data.toLowerCase().includes("game")) {
				delete model.stage;
				return resolve(model);
			}
			// if (model.data.toLowerCase().includes("expert")) {
			// 	model.stage = '';
			// } 
			else {
				console.log("-------------Rejectfor ocp -----------");
				return reject(model);
			}
		});
	},


	q1: (model) => {
		return new Promise(async function (resolve, reject) {
			if (model.data.toLowerCase().includes("correct")) {
				// await sendExternalMessage(data, 'That’s a myth, So, ECPs won’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies,They do not cause abortion.')
				model.tags.answern1 = false
			} else if (model.data.toLowerCase().includes("false")) {
				// await sendExternalMessage(data, 'You’re right, ECPs don’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies, They do not cause abortion.')
				model.tags.answern1 = true
			} else {
				reject(model)
			}
			delete model.stage
			resolve(model)
		})
	},
	q2: (model) => {
		return new Promise(async function (resolve, reject) {
			if (model.data.toLowerCase().includes("not correct")) {
				// await sendExternalMessage(data, 'That’s a myth, So, ECPs won’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies,They do not cause abortion.')
				model.tags.answern2 = false
			} else if (model.data.toLowerCase().includes("correct")) {
				// await sendExternalMessage(data, 'You’re right, ECPs don’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies, They do not cause abortion.')
				model.tags.answern2 = true
			} else {
				reject(model)
			}
			delete model.stage
			resolve(model)
		})
	},

	q3: (model) => {
		return new Promise(async function (resolve, reject) {
			if (model.data.toLowerCase().includes("not")) {
				// await sendExternalMessage(data, 'That’s a myth, So, ECPs won’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies,They do not cause abortion.')
				model.tags.answer3 = false
			} else if (model.data.toLowerCase().includes("true")) {
				// await sendExternalMessage(data, 'You’re right, ECPs don’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies, They do not cause abortion.')
				model.tags.answer3 = true
			} else {
				reject(model)
			}
			delete model.stage
			resolve(model)
		})
	},

	city: data => {
		console.log(data.data);
		return new Promise(function (resolve, reject) {
			if (
				stringSimilarity.findBestMatch(toTitleCase(data.data), cities).bestMatch
				.rating == 1
			) {
				data.tags.cityMatches = undefined;
				data.tags.city = toTitleCase(data.data);
				delete data.stage;
				resolve(data);
			} else {
				data.tags.cityMatches = sort(toTitleCase(data.data), cities);
				resolve(data);
			}
		});
		return data;
	}
};

function toTitleCase(str) {
	str = str.toLowerCase().split(" ");
	let final = [];
	for (let word of str) {
		final.push(word.charAt(0).toUpperCase() + word.slice(1));
	}
	return final.join(" ");
}

function sort(inp, data) {
	console.log(data.length);
	matches = stringSimilarity.findBestMatch(inp, data);
	arr = [];
	rating = 0.3;
	matches.ratings = matches.ratings.sort(sortBy("-rating"));
	console.log(matches);
	while (matches.ratings.length > 9) {
		matches.ratings.forEach(function (match) {
			if (match.rating > rating) {
				arr.push(match);
			}
		});
		matches.ratings = arr;
		arr = [];
		rating += 0.01;
	}
	return matches.ratings;
}