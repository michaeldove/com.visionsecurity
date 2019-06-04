'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// Vision Security ZM1621 Outdoor Battery Operated Siren

module.exports = new ZwaveDriver(path.basename(__dirname), {
	debug: false,
	capabilities: {
               'onoff': {
                        'command_class': 'COMMAND_CLASS_SWITCH_BINARY',
                        'command_get': 'SWITCH_BINARY_GET',
                        'command_set': 'SWITCH_BINARY_SET',
                        'command_set_parser': value => {
                                return {
                                        'Switch Value': (value > 0) ? 255 : 0
                                };
                        },
                        'command_report': 'SWITCH_BINARY_REPORT',
                        'command_report_parser': report => report['Value'] === 'on/enable'
                },
                'measure_battery': {
                        'command_class': 'COMMAND_CLASS_BATTERY',
                        'command_get': 'BATTERY_GET',
                        'command_report': 'BATTERY_REPORT',
                        'command_report_parser': report => {
                                if (report['Battery Level'] === "battery low warning") return 1;

                                return report['Battery Level (Raw)'][0];
                        }
                }
        },
	settings: {
		'siren_strobe_mode': {
			index: 1,
			size: 1
		},
		'alarm_auto_stop': {
			index: 2,
			size: 1
		}
	}
});

Homey.manager('flow').on('action.turn_alarm_on', function( callback, args ){
	Homey.log('');
	Homey.log('on flow action.action.turn_alarm_on');
	Homey.log('args', args);

	Homey.manager('drivers').getDriver('ZM1621').capabilities.onoff.set(args.device, true, function (err, data) {
		Homey.log('');
		Homey.log('Homey.manager(drivers).getDriver(ZM1621).capabilities.onoff.set');
		Homey.log('err', err);
		Homey.log('data', data);
		if (err) callback (err, false);
	});

	callback( null, true );
});

Homey.manager('flow').on('action.turn_alarm_off', function( callback, args ){
	Homey.log('');
	Homey.log('on flow action.action.turn_alarm_on');
	Homey.log('args', args);

	Homey.manager('drivers').getDriver('ZM1621').capabilities.onoff.set(args.device, false, function (err, data) {
		Homey.log('');
		Homey.log('Homey.manager(drivers).getDriver(ZM1621).capabilities.onoff.set');
		Homey.log('err', err);
		Homey.log('data', data);
		if (err) callback (err, false);
	});

	callback( null, true );
});
