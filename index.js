// It will require and run our main fetch function.
// index.js
// The code below is temporary and can be commented out.
// const { fetchMyIP } = require("./iss");

// const { fetchCoordsByIP } = require("./iss");

//I don't know if this is correct
const fetchMyIP = require("./iss").fetchMyIP;
const fetchCoordsByIP = require("./iss").fetchCoordsByIP;

//we call my fetchMyIP function (that lives in iss.js) and pass in anline function
// that uses the error and ip information gained by calling fetchMyIP
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! Returned IP:", ip);

  // we call my fetchCoordsByIP function (that lives in iss.js) and pass in the IP address and an anline function
  // that uses the error and data (longitude and lattitude) information gained by calling fetchCoordsByIP
  fetchCoordsByIP(ip, (error, coordinates) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    console.log("It worked! Returned latitude and longitude:", coordinates);
  });
});
