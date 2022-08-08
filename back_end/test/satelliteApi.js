/* test/sum.js */

var satellite = require("../apis/getSatelliteData");

var expect = require("chai").expect;

describe("testing (mock) API call", function () {
  context("getSatelliteData()", function () {
    it("should return data in an array", async function () {
      const data = await satellite.getData();
      //console.log("data is: ", data);
      expect(data).to.be.an("array");
    });
    it("should have first value in data be DEMO_SAT", async function () {
      const data = await satellite.getData();
      //console.log("data is: ", data);
      expect(data[0].Spacecraft).to.equal("DEMO_SAT");
    });
    it("should have csv_telemetry data", async function () {
      const data = await satellite.getData();
      //console.log("data is: ", data);
      expect(data[0].csv_telemetry).to.be.not.null;
    });
  });
});
