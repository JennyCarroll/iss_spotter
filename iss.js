// It will contain most of the logic for fetching the data from each API endpoint.
// Fetch our IP Address
// Fetch the geo coordinates (Latitude & Longitude) for our IP
// Fetch the next ISS flyovers for our geo coordinates
const request = require("request");

// Define a function fetchMyIP which will asynchronously return our IP Address using an API.
//accepts one parameter, a callback (to pass bak an error or the IP string)
const fetchMyIP = function (callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    //I don't understand why we put null next to error
    if (error) return callback(error, null);

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

module.exports = { fetchMyIP };
