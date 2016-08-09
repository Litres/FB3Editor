/**
 * Загрузчик описания с хаба.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.desc.Loader',
	{
		/**
		 * @property {String} Адрес загрузки/сохранения описания.
		 */
		url: 'https://hub.litres.ru/pages/get_fb3_meta/',
		
		/**
		 * @private
		 * @property {String} Адрес загрузки описания.
		 */
		loadUrl: null,

		/**
		 * @private
		 * @property {String} Адрес сохранения описания.
		 */
		saveUrl: null,

		/**
		 * @private
		 * @property {Number} Айди произведения на хабе.
		 */
		art: null,

		/**
		 * Инициализирует адреса загрузки и сохранения.
		 */
		constructor: function ()
		{
			var me = this,
				routeManager = FBEditor.route.Manager,
				params;

			params = routeManager.getParams();

			if (params.art)
			{
				me.setArt(params.art);
			}

			me.saveUrl = me.url;
		},

		/**
		 * Загружает описание.
		 */
		load: function (resolve, reject)
		{
			var me = this,
				url = me.loadUrl;
			
			Ext.log(
				{
					level: 'info', 
					msg: 'Загрузка описания из ' + url
				}
			);

			// формируем запос
			Ext.Ajax.request(
				{
					url: url,
					scope: this,
					success: function(response)
					{
						var xml;
						
						if (response && response.responseText)
						{
							xml = response.responseText;
							resolve(xml);
						}
						else
						{
							reject(response);
						}
					},
					failure: function (response)
					{
						reject(response);
					}
				}
			);
		},

		/**
		 * Сохраняет описание на хабе.
		 * @param {String} xml Описание.
		 */
		save: function (xml, resolve, reject)
		{
			var me = this,
				url = me.saveUrl,
				art = me.getArt();
			
			Ext.log(
				{
					level: 'info', 
					msg: 'Сохранение описания в ' + url
				}
			);

			// отправляем запрос
			Ext.Ajax.request(
				{
					url: url,
					disableCaching: true,
					params: {
						action: 'update_hub_on_fb3_meta',
						fb3_meta: xml,
						art: art
					},
					success: function (response)
					{
						var xmlResponse;

						if (response.responseXML)
						{
							xmlResponse = response.responseText;

							resolve(xmlResponse);
						}
						else
						{
							reject(response);
						}
					},
					failure: function (response)
					{
						reject(response);
					}
				}
			);
		},

		/**
		 * Определяет загружается (загружено) ли описание с хаба.
		 * @return {Boolean}
		 */
		isLoad: function ()
		{
			var me = this,
				url = me.loadUrl,
				res;

			res = url && url !== 'undefined' ? true : false;

			return res;

		},

		/**
		 * Возвращает айди произведения, загружаемого с хаба.
		 * @return {Number}
		 */
		getArt: function ()
		{
			return this.art;
		},

		/**
		 * Устанавливает айди произведения.
		 * @param {Number} art
		 */
		setArt: function (art)
		{
			var me = this;

			me.art = art;
			me.loadUrl = me.url + '?art=' + art;
		}
	}
);