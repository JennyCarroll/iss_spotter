// It will require and run our main fetch function.
// index.js
// The code below is temporary and can be commented out.
// const { fetchMyIP } = require("./iss");
// const { fetchCoordsByIP } = require("./iss");
// const { fetchISSFlyOverTimes } = require('./iss');

//I don't know if this is correct
const fetchMyIP = require("./iss").fetchMyIP;
const fetchCoordsByIP = require("./iss").fetchCoordsByIP;
const fetchISSFlyOverTimes = require("./iss").fetchISSFlyOverTimes;
const nextISSTimesForMyLocation = require("./iss").nextISSTimesForMyLocation;

nextISSTimesForMyLocation((error, passes) => {
  if (error) {
    console.log(error);
  }
  // console.log(passes);
  for (let object of passes) {
    const dateTime = new Date(0);
    const dateTimeInNumbers = dateTime.setUTCSeconds(object.risetime);
    const dateTimeInWords = new Date(dateTimeInNumbers);
    console.log(
      `Next pass at ${dateTimeInWords.toString()} for ${
        object.duration
      } seconds!`
    );
  }
});
