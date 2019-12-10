var cities = require("../../cities.json");
var stringSimilarity = require("string-similarity");
var sortBy = require("sort-by");
var sendExternalMessage = require("../../external.js");
var request = require("request");

module.exports = {
	ocpintro: model => {
		return new Promise(function (resolve, reject) {
			console.log(model.data + "----------------------");
			if (model.data.toLowerCase().includes("how to use")) {
				delete model.stage;
				return resolve(model);
			} else {
				console.log("-------------RejectOcp Intro-----------");
				return reject(model);
			}
		});
	},

	use: model => {
		return new Promise(function (resolve, reject) {
			console.log(model.data);
			if (model.data.toLowerCase().includes("okay")) {
				delete model.stage;
				return resolve(model);
			} else {
				console.log("-------------Rejectfor Use Intro-----------");
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
				model.stage = 'helpline';
				return resolve(model);
			}
		});
	},


	q1: (model) => {
		return new Promise(async function (resolve, reject) {
			if (model.data.toLowerCase().includes("myth")) {
				// await sendExternalMessage(data, 'That’s a myth, So, ECPs won’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies,They do not cause abortion.')
				model.tags.answer1 = false
			} else if (model.data.toLowerCase().includes("fact")) {
				// await sendExternalMessage(data, 'You’re right, ECPs don’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies, They do not cause abortion.')
				model.tags.answer1 = true
			} else {
				reject(model)
			}
			delete model.stage
			resolve(model)
		})
	},
	q2: (model) => {
		return new Promise(async function (resolve, reject) {
			if (model.data.toLowerCase().includes("myth")) {
				// await sendExternalMessage(data, 'That’s a myth, So, ECPs won’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies,They do not cause abortion.')
				model.tags.answer2 = false
			} else if (model.data.toLowerCase().includes("true")) {
				// await sendExternalMessage(data, 'You’re right, ECPs don’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies, They do not cause abortion.')
				model.tags.answer2 = true
			} else {
				reject(model)
			}
			delete model.stage
			resolve(model)
		})
	},

	q3: (model) => {
		return new Promise(async function (resolve, reject) {
			if (model.data.toLowerCase().includes("myth")) {
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



	q4: (model) => {
		return new Promise(async function (resolve, reject) {
			if (model.data.toLowerCase().includes("call")) {
				// await sendExternalMessage(data, 'That’s a myth, So, ECPs won’t work after conception (when the sperm fertilizes the egg),They are designed only to prevent pregnancies,They do not cause abortion.')
				model.stage = 'helpline'
				resolve(model)
			} else {
				model.stage = 'mainmenu'
				resolve(model)
			}
			//delete model.stage

		})
	},
	helpline: (model) => {
		return new Promise(async function (resolve, reject) {
			if (model.data.toLowerCase().includes("startflow"))
				model.stage = 'mainmenu'
			resolve(model)

		})
	},


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