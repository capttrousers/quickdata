var fs = require("fs")
var xmlParse = require("xml2js").parseString

var twb2schema = require("./server/utils/twb2schema")

var twb = {}

xmlParse(fs.readFileSync(".\\client\\textFiles\\test-multiple-connections-same-ds.twb", "utf-8"), (err, result) => {twb = result})


var connections = twb2schema(twb);