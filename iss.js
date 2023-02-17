// It will contain most of the logic for fetching the data from each API endpoint.
// Fetch our IP Address
// Fetch the geo coordinates (Latitude & Longitude) for our IP
// Fetch the next ISS flyovers for our geo coordinates
const request = require("request");

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

//Define a function which takes in an IP address and returns the latitude and longitude for it.
//it should take in two arguments, IP as a string and a callback.
const fetchCoordsByIP = function (IP, callback) {
  request(`http://ipwho.is/${IP}`, (error, response, body) => {
    if (error) {
      callback(error, null);
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

//is this right?
module.exports = { fetchMyIP, fetchCoordsByIP };
