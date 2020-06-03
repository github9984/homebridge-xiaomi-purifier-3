var MIoTDevice = require('./MIoTDevice');

class MIoTAirPurifier extends MIoTDevice {
    constructor(did, token, ip) {
        super(did, token, ip);

        this.dictionary = {
            'power'          : [ 2,  2], // 
            'fan'            : [ 2,  4], // Fan Level : 1(Level 1), 2(Level 2), 3(Level 3)
            'mode'           : [ 2,  5], // Mode : 0(Auto), 1(Sleep), 2(Favorite), 3(None)
            'aqi'            : [ 3,  6], // PM2.5 Density : 0-600 1
            'humidity'       : [ 3,  7], // Relative Humidity: 0-100(Percentage)
            'temp'           : [ 3,  8], // Temperature: -40-125 0.1
            'filter_level'   : [ 4,  3], // Filter Live Level : 0-100(Percentage)
            'child_lock'     : [ 7,  1], // Physical Control Locked : bool
            'led_brightness' : [ 6,  1], // 0 (bright), 1 (dim), 2 (off)            
            'buzzer'         : [ 5,  1], // bool
            'motor_speed'    : [10,  8], // motor1-speed : 0-3000 : 0-3000 1

            // 'speed_read'   : [10,  9], // motor1-speed : 0-3000 : 0-3000 1
            // 'aqi_heartbeat': [13,  9]  // aqi-updata-heartbeat: 0 - 65534
        }

        for (var propertyName in this.dictionary) {
            this.trackProperty(this.dictionary[propertyName][0], this.dictionary[propertyName][1]);
        };

        // this.onChange('aqi_heartbeat', value => {
        //     if (value <= 0) { this.set('aqi_heartbeat', 60); }
        // });
    }

    get(propertyName) {
        if (! this.dictionary.hasOwnProperty(propertyName)) {
            throw 'MIoTDevice property \''+propertyName+'\' is not defined';
        }

        return this.getProperty(this.dictionary[propertyName][0], this.dictionary[propertyName][1]);
    }

    set(propertyName, value) {
        if (! this.dictionary.hasOwnProperty(propertyName)) {
            throw 'MIoTDevice property \''+propertyName+'\' is not defined';
        }

        this.setProperty(this.dictionary[propertyName][0], this.dictionary[propertyName][1], value);
    }

    onChange(propertyName, callback) {
        if (! this.dictionary.hasOwnProperty(propertyName)) {
            throw 'MIoTDevice property \''+propertyName+'\' is not defined';
        }

        this.onChangeProperty(this.dictionary[propertyName][0], this.dictionary[propertyName][1], callback);
    }

    getSpeed() {
        var value = this.get('motor_speed');
        return Math.round(((value-390)/1760) * 100);
    }

     setSpeed(speed) {
         var targetValue = Math.round(speed/100 * 1760) + 390;
         this.set('motor_speed', targetValue);
     }
}

module.exports = MIoTAirPurifier
