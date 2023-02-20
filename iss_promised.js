const request = require("request-promise-native");
// * Requests user's ip address from https://www.ipify.org/
// * Input: None
// * Returns: Promise of request for ip data, returned as JSON string

const fetchMyIP = function () {
  return request("https://api.ipify.org?format=json").then((body) => {
    const IP = JSON.parse(body).ip;
    return IP;
  });
};
// * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
// * Input: JSON string containing the IP address
// * Returns: Promise of request for lat/lon

const fetchCoordsByIP = function (IP) {
  return request(`http://ipwho.is/${IP}`).then((body) => {
    const parsedBody = JSON.parse(body);
    let data = {};
    data.latitude = parsedBody.latitude;
    data.longitude = parsedBody.longitude;
    return data;
  });
};
// * Requests data from https://iss-flyover.herokuapp.com using provided lat/long data
// * Input: JSON body containing geo data response from ipwho.is
// * Returns: Promise of request for fly over data, returned as JSON string

const fetchISSFlyOverTimes = function (data) {
  return request(
    `https://iss-flyover.herokuapp.com/json/?lat=${data.latitude}&lon=${data.longitude}`
  ).then((body) => {
    const passes = JSON.parse(body).response;
    return passes;
  });
};
const nextISSTimesForMyLocation = function () {
  return fetchMyIP()
    .then((IP) => {
      return fetchCoordsByIP(IP);
    })
    .then((data) => {
      return fetchISSFlyOverTimes(data);
    });
};

module.exports = {
  nextISSTimesForMyLocation,
};
