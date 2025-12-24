'use strict';

define('admin/plugins/discord-notification', ['settings'], function (Settings) {
	let discordNotification = {};

	discordNotification.init = function () {
		Settings.load('discord-notification', $('.discord-notification-settings'), function (err, settings) {
			if (err) {
				settings = {};
			}

			var defaults = {
				webhookURL: '',
				maxLength: 1024,
				postCategories: '',
				topicsOnly: false,
				messageContent: '',
			};

			// Set defaults
			for (const setting of Object.keys(defaults)) {
				if (!settings.hasOwnProperty(setting)) {
					if (typeof defaults[setting] === 'boolean') {
						$('#' + setting).prop('checked', defaults[setting]);
					} else {
						$('#' + setting).val(defaults[setting]);
					}
				}
			}
		});

		$('#save').on('click', function () {
			console.log('Saving settings');
			Settings.save('discord-notification', $('.discord-notification-settings'));
		});
	};

	return discordNotification;
});
