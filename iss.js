// It will contain most of the logic for fetching the data from each API endpoint.
const request = require("request");

// XFetch our IP Address
// Define a function fetchMyIP which will asynchronously return our IP Address using an API.
//getchMyIP is a function that accepts a callback as a parameter and calls it
// (to pass back an error or the IP string) which it gained through an API request
const fetchMyIP = function (callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    //I don't understand why we put null next to error
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //parse and extract the IP address using JSON and pass that through to the callback as the second argument
    const IP = JSON.parse(body).ip;
    callback(null, IP);
  });
};

// Fetch the geo coordinates (Latitude & Longitude) for our IP
//Define a function which takes in an IP address and returns the latitude and longitude for it.
//it should take in two arguments, IP as a string and a callback.
const fetchCoordsByIP = function (IP, callback) {
  request(`http://ipwho.is/${IP}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinatess. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // In the function, make the request to the API, and have it pass back the relevant
    // (lat/lng) data as an object via callback.
    const parsedBody = JSON.parse(body);
    // check if "success" is true or not
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }
    let data = {};
    data.latitude = parsedBody.latitude;
    data.longitude = parsedBody.longitude;
    // The resulting data sent back via the callback should be an object with only two data properties.
    callback(null, data);
  });
};

// * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
// As input it expects a latitude/longitude pair, an altitude, and how many results to return.

const fetchISSFlyOverTimes = function (coordinates, callback) {
  request(
    `https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }

      // if non-200 status, assume server error
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      const passes = JSON.parse(body).response;

      // As output you get the same inputs back (for checking) and a time stamp when the API ran
      // in addition to a success or failure message and a list of passes.
      // Each pass has a duration in seconds and a rise time as a unix time stamp.
      callback(null, passes);
    }
  );
};

//we need one primary function for index.js to call// error, passTimes
const nextISSTimesForMyLocation = function (callback) {
  // if (error) {
  //   console.log("It didn't work!", error);
  //   return;
  // }
  //we call my fetchMyIP function (that lives in iss.js) and pass in anline function
  // that uses the error and ip information gained by calling fetchMyIP
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    // console.log("It worked! Returned IP:", ip);

    // we call my fetchCoordsByIP function (that lives in iss.js) and pass in the IP address and an anline function
    // that uses the error and data (longitude and lattitude) information gained by calling fetchCoordsByIP
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        return callback(error, null);
      }

      // console.log("It worked! Returned latitude and longitude:", coordinates);

      fetchISSFlyOverTimes(coordinates, (error, passes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, passes);
        // console.log("It worked! Returned flyover times:", passTimes);
      });
    });
  });

  // success, print out the deets!
  // console.log(passes);
};

//is this right?
module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};

//I guess I didn't need this because the API outputs it already let unixTimeStamp = new Date().getTime()
