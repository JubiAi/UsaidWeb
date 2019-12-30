var cities = require('../../cities.json')
var stringSimilarity = require('string-similarity');
var sortBy = require('sort-by')
var sendExternalMessage = require('../../external.js')
var request = require('request')

module.exports = {

	start: (data) => {
		return new Promise(function (resolve, reject) {
			console.log(data.data)
			if (data.data.toLowerCase().includes("yes")) {
				console.log("First stage")
				console.log(data)
				return resolve(data)
			} else {
				return reject(data)
			}
		})
	},


	conAge: (data) => {
		return new Promise(function (resolve, reject) {
			console.log(data.data.toLowerCase())
			if (data.data.toLowerCase() == "i am over 15") {
				console.log("I am over 15")
				data.tags.accepted = true
				data.tags.rejected = false
				data.stage = "disclaimer"
			} else {
				console.log("I am under 15")
				data.tags.rejected = true
				data.tags.accepted = false
				data.stage = "underage"
			}
			console.log("+++++++++++++")
			console.log(data.tags)
			console.log("+++++++++++++")
			return resolve(data)
		})
	},

	disclaimer: (data) => {
		return new Promise(function (resolve, reject) {
			console.log(data.data)
			if (data.data.toLowerCase() == "i agree") {
				console.log("I agree")
				data.stage = "carousalone"
			} else {
				console.log("Disagree")
				data.tags.rejected = true
				data.stage = "disclaimer"
			}
			return resolve(data)
		})
	},

	ageStage: data => {
		return new Promise(function (resolve, reject) {
			if (data.data == "15-24" || parseInt(data.data) >= 15 && parseInt(data.data) <= 24) {
				console.log("15-24")
				data.stage = "genderStage"
			} else if (data.data == "25-34" || parseInt(data.data) >= 25 && parseInt(data.data) <= 34) {
				console.log("25-34")
				data.stage = "genderStage"
			} else if (data.data == "35-44" || parseInt(data.data) >= 35 && parseInt(data.data) <= 44) {
				console.log("35-44")
				data.stage = "genderStage"
			} else if (data.data == "44+" || parseInt(data.data) >= 45 && parseInt(data.data) <= 100) {
				console.log("44+")
				data.stage = "genderStage"
			} else if (parseInt(data.data) > 100) {
				data.stage = "ageStage"
			}
			resolve(data)
		})
	},

	city: (data) => {
		console.log(data.data)
		return new Promise(function (resolve, reject) {
			if (stringSimilarity.findBestMatch(toTitleCase(data.data), cities).bestMatch.rating == 1) {
				data.tags.cityMatches = undefined
				data.tags.city = toTitleCase(data.data)
				delete data.stage
				resolve(data)
			} else {
				data.tags.cityMatches = sort(toTitleCase(data.data), cities)
				resolve(data)
			}
		})
		return data
	},

}

function toTitleCase(str) {
	str = str.toLowerCase().split(' ');
	let final = [];
	for (let word of str) {
		final.push(word.charAt(0).toUpperCase() + word.slice(1));
	}
	return final.join(' ')
}

function sort(inp, data) {
	console.log(data.length)
	matches = stringSimilarity.findBestMatch(inp, data)
	arr = []
	rating = 0.30
	matches.ratings = matches.ratings.sort(sortBy('-rating'));
	console.log(matches)
	while (matches.ratings.length > 9) {
		matches.ratings.forEach(function (match) {
			if (match.rating > rating) {
				arr.push(match)
			}
		})
		matches.ratings = arr
		arr = []
		rating += 0.01
	}
	return matches.ratings
}