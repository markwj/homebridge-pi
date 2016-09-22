# homebridge-pi

A homebridge sensor for Raspberry Pi.

# Installation

1. Install Homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-pi`
4. Update your Homebridge `config.json` using the sample below.

# Configuration

```json
{
  "accessory": "PiTemperature",
  "name": "Raspberry PI Temperature"
}
```

Fields:

* `accessory` must be "PiTemperature" (required).
* `name` is the name of the published accessory (required).

