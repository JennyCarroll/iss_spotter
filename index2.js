const { nextISSTimesForMyLocation } = require("./iss_promised");

//why don't I have to pass in the body each time?
// fetchMyIP()
//   .then(fetchCoordsByIP(body))
//   .then(fetchISSFlyOverTimes(body));

nextISSTimesForMyLocation()
  .then((passes) => {
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
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
