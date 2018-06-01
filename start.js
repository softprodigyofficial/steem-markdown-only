require('babel-register')({
    "presets": ["es2015", "stage-0", "react", "env"],
	"plugins": ["transform-runtime", "transform-decorators-legacy"]
})

// Import the rest of our application.
module.exports = require('./index.js')
