"use strict";

var fs = require('fs');

var Service, Characteristic;
var temperatureService;

module.exports = function (homebridge)
  {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-pi", "PiTemperature", PiTemperatureAccessory);
  }

function PiTemperatureAccessory(log, config)
  {
  this.log = log;
  this.name = config['name'];
  this.lastupdate = 0;
  }

PiTemperatureAccessory.prototype =
  {
  getState: function (callback)
    {
    // Only fetch new data once per minute
    if (this.lastupdate + 60 < (Date.now() / 1000 | 0))
      {
      var data = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8');
      if (typeof data == 'undefined') { return this.log("Failed to read temperature file"); }
      this.temperature = (0.0+parseInt(data))/1000;
      }
    this.log("Rasperberry Pi CPU/GPU temperature at " + this.temperature);
    temperatureService.setCharacteristic(Characteristic.CurrentTemperature, this.temperature);
    callback(null, this.temperature);
    },

  identify: function (callback)
    {
    this.log("Identify requested!");
    callback(); // success
    },

  getServices: function ()
    {
    var informationService = new Service.AccessoryInformation();

    var data = fs.readFileSync('/proc/cpuinfo', 'utf8');
    if (typeof data == 'undefined') { return this.log("Failed to read /proc/cpuinfo"); }
    var model = data.match(/Hardware\s+\:\s*(\S+)/)[1] + "/" + data.match(/Revision\s+\:\s*(\S+)/)[1];
    var serial = data.match(/Serial\s+\:\s*(\S+)/)[1];
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Raspberry")
      .setCharacteristic(Characteristic.Model, model)
      .setCharacteristic(Characteristic.SerialNumber, serial);
    this.log("Model " + model + " Serial " + serial);

    temperatureService = new Service.TemperatureSensor(this.name);
    temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getState.bind(this));

    temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({minValue: -30});
        
    temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({maxValue: 120});

    return [informationService, temperatureService];
    }
  };

if (!Date.now)
  {
  Date.now = function() { return new Date().getTime(); }
  }
