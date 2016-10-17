/**
 * Загрузчик описания с хаба.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.desc.Loader',
	{
		extend : 'FBEditor.loader.Loader',
		
		loadAction: 'https://hub.litres.ru/pages/get_fb3_meta/',

		/**
		 * Инициализирует адреса загрузки и сохранения.
		 */
		constructor: function ()
		{
			var me = this,
				routeManager = FBEditor.route.Manager,
				params,
				art;
			
			me.callParent(arguments);
			params = routeManager.getParams();
			art = params.art;

			if (art)
			{
				me.setArt(art);
			}
		},

		/**
		 * Загружает описание.
		 * @param {Number} [art] Айди произведениея на хабе.
		 */
		load: function (art)
		{
			var me = this,
				url,
				promise;

			if (art)
			{
				// устанавливаем айди произведения
				me.setArt(art);
			}

			url = me.getLoadUrl();
			
			Ext.log(
				{
					level: 'info',
					msg: 'Загрузка описания из ' + url
				}
			);
			
			promise = new Promise(
				function (resolve, reject)
				{
					// формируем запос
					Ext.Ajax.request(
						{
							url: url,
							scope: this,
							success: function(response)
							{
								var xml;

								if (response && response.responseText && /^<\?xml/ig.test(response.responseText))
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
				}
			);

			return promise;
		},

		/**
		 * Сохраняет описание на хабе.
		 * @param {String} xml Описание.
		 */
		save: function (xml)
		{
			var me = this,
				url = me.getSaveUrl(),
				art = me.getArt(),
				promise;

			Ext.log(
				{
					level: 'info',
					msg: 'Сохранение описания в ' + url
				}
			);
			
			promise = new Promise(
				function (resolve, reject)
				{
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
				}
			);
			
			return promise;
		}
	}
);