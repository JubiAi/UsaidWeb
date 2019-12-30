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
        model.tags.answer1 = true;
        delete model.stage;
        return resolve(model);
      } else {
        model.tags.answer1 = false;
        delete model.stage;
        return resolve(model);
      }
    });
  },

  hstp: model => {
    return new Promise(function (resolve, reject) {
      console.log(model.data);
      if (model.data.toLowerCase().includes("htsp")) {
        model.tags.happyfamily_image =
          "http://development.jubi.ai/usaidWeb/images/happyfamily.jpg";
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
        model.tags.happyfamily_image =
          "http://development.jubi.ai/usaidWeb/images/happyfamily.jpg";
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
        model.tags.motherchild_image =
          "http://development.jubi.ai/usaidWeb/images/motherchild.jpg";
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

  q1: model => {
    return new Promise(async function (resolve, reject) {
      if (model.data.toLowerCase().includes("correct")) {
        model.tags.answern1 = false;
      } else if (model.data.toLowerCase().includes("false")) {
        model.tags.answern1 = true;
      } else {
        reject(model);
      }
      delete model.stage;
      resolve(model);
    });
  },
  q2: model => {
    return new Promise(async function (resolve, reject) {
      if (model.data.toLowerCase().includes("not correct")) {
        model.tags.answern2 = false;
      } else if (model.data.toLowerCase().includes("correct")) {
        model.tags.answern2 = true;
      } else {
        reject(model);
      }
      delete model.stage;
      resolve(model);
    });
  },

  q3: model => {
    return new Promise(async function (resolve, reject) {
      if (model.data.toLowerCase().includes("not")) {
        model.tags.answer3 = false;
      } else if (model.data.toLowerCase().includes("true")) {
        model.tags.answer3 = true;
      } else {
        reject(model);
      }
      delete model.stage;
      resolve(model);
    });
  }

}