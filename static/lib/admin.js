'use strict';

define('admin/plugins/discord-notification', ['settings', 'alerts'], function (Settings, alerts) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('discord-notification', $('.discord-notification-settings'));

		$('#save').on('click', function () {
			Settings.save('discord-notification', $('.discord-notification-settings'), function () {
				alerts.alert({
					type: 'success',
					alert_id: 'discord-notification-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function () {
						socket.emit('admin.reload');
					},
				});
			});
		});
	};

	return ACP;
});
