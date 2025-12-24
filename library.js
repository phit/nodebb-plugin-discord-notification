'use strict';

const user = require.main.require('./src/user');
const topics = require.main.require('./src/topics');
const categories = require.main.require('./src/categories');
const translator = require.main.require('./src/translator');
const meta = require.main.require('./src/meta');
const nconf = require.main.require('nconf');
const async = require.main.require('async');

const Discord = require('discord.js');

let hook = null;
var forumURL = nconf.get('url');

const renderAdmin = async function(req, res, next) {
	const allCategories = await categories.buildForSelectAll(['value', 'text']);
	res.render(
		'admin/plugins/discord-notification',
		{
			title: '[[discord-notification:title]]',
			allCategories: allCategories,
		}
	);
}

const discordNotification = {
	config: {},

	onLoad: async function(params) {
		const routeHelpers = require.main.require('./src/routes/helpers');
		routeHelpers.setupAdminPageRoute(params.router, '/admin/plugins/discord-notification', renderAdmin);
		discordNotification.init();
	},

	init: function () {
		// Load saved config
		const _self = this;
		const defaults = {
			webhookURL: '',
			maxLength: 1024,
			postCategories: '',
			topicsOnly: 'off',
			messageContent: '',
		};
		const notCheckboxes = ['webhookURL', 'maxLength', 'postCategories', 'messageContent'];

		meta.settings.get('discord-notification', (err, options) => {
			if (err) {
				winston.warn(`[plugin//discord-notification] Unable to retrieve settings, assuming defaults: ${err.message}`);
			}

			Object.keys(defaults).forEach((field) => {
				// If not set in config (nil)
				if (!options.hasOwnProperty(field)) {
					_self.config[field] = defaults[field];
				} else if (!notCheckboxes.includes(field)) {
					_self.config[field] = options[field] === 'on';
				} else {
					_self.config[field] = options[field];
				}
			});
		});
	},

	postSave: function(post) {
		post = post.post;
		var topicsOnly = discordNotification.config['topicsOnly'] || 'off';

		if (topicsOnly === 'off' || (topicsOnly === 'on' && post.isMain)) {
			var content = post.content;

			async.parallel({
				user: function(callback) {
					user.getUserFields(post.uid, ['username', 'picture'], callback);
				},
				topic: function(callback) {
					topics.getTopicFields(post.tid, ['title', 'slug'], callback);
				},
				category: function(callback) {
					categories.getCategoryFields(post.cid, ['name', 'bgColor'], callback);
				}
			}, function(err, data) {
				var categories = JSON.parse(discordNotification.config['postCategories']);

				if (!categories || categories.indexOf(String(post.cid)) >= 0) {
					// Trim long posts:
					var maxQuoteLength = discordNotification.config['maxLength'] || 1024;
					if (content.length > maxQuoteLength) { content = content.substring(0, maxQuoteLength) + '...'; }

					// Ensure absolute thumbnail URL if an avatar exists:
					var thumbnail = null;

					if (data.user.picture && data.user.picture.match(/^\//)) {
						thumbnail = forumURL + data.user.picture;
					} else if (data.user.picture) {
						thumbnail = data.user.picture;
					}

					// Add custom message:
					const messageContent = discordNotification.config['messageContent'] || '';
					
					// Make the rich embed:
					const embed = new Discord.EmbedBuilder()
						.setColor(data.category.bgColor)
						.setURL(forumURL + '/topic/' + data.topic.slug)
						.setTitle(data.category.name + ': ' + data.topic.title)
						.setDescription(content)
						.setFooter({ text: data.user.username, iconURL: thumbnail })
						.setTimestamp();
					// Send notification:
					if (hook) {
						hook.send({content: messageContent, embeds: [embed]})
							.catch(console.error);
					}
				}
			});
		}
	},

	addAdminMenu: function(header, callback) {
		translator.translate('[[discord-notification:title]]', function(title) {
			header.plugins.push({
				route : '/plugins/discord-notification',
				icon  : 'fa-bell',
				name  : title
			});

			callback(null, header);
		});
	},

	getConfig: async (config) => {
		let { webhookURL, maxLength, postCategories, topicsOnly, messageContent } = await meta.settings.get('discord-notification');

		try {
			// Parse Webhook URL (1: ID, 2: Token)
			const discordRegex = /https:\/\/discord(?:app)?\.com\/api\/webhooks\/([0-9]+?)\/(.+?)$/;
			const match = webhookURL.match(discordRegex);

			if (match) {
				hook = new Discord.WebhookClient({ id: match[1], token: match[2] });
			}
		} catch (e) {
			// Do nothing
		}

		config.discordNotification = {
			webhookURL,
			maxLength,
			postCategories,
			topicsOnly,
			messageContent
		};

		return config;
	},
};

module.exports = discordNotification;