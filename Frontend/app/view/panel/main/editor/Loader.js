/**
 * Загрузчик тела с хаба.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.Loader',
	{
		extend : 'FBEditor.loader.Loader',

		/**
		 * @property {String} Адрес загрузки/сохранения.
		 */
		url: 'https://hub.litres.ru/pages/get_fb3_body/',
		
		statics: {
			/**
			 * @private
			 * @property {FBEditor.view.panel.main.editor.Loader} Загрузчик.
			 */
			loader: null,

			/**
			 * Создает и возвращает загрузчик.
			 * @return {FBEditor.view.panel.main.editor.Loader}
			 */
			getLoader: function ()
			{
				var me = this,
					loader = me.loader;

				loader = loader || Ext.create('FBEditor.view.panel.main.editor.Loader');
				me.loader = loader;

				return loader;
			}
		},

		/**
		 * Инициализирует адреса загрузки и сохранения.
		 */
		constructor: function ()
		{
			var me = this,
				routeManager = FBEditor.route.Manager,
				params,
				art;

			params = routeManager.getParams();
			art = params.body_art;

			if (art)
			{
				me.setArt(art);
			}
		},

		/**
		 * Загружает тело.
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
					msg: 'Загрузка тела книги из ' + url
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
								var xml,
									xmlTest,
									xml2,
									startTime;

								if (response && response.responseText && /^<\?xml/ig.test(response.responseText))
								{
									xml = response.responseText;

									xmlTest = xml + '<!-- rev 12345 -->';
									startTime = new Date().getTime();
									console.log('responseText', startTime);
									xml2 = xmlTest.match(/rev (\d+) -->$/);
									console.log('after match rev', new Date().getTime(), new Date().getTime() - startTime, xml2);

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
		 * Сохраняет тело на хабе.
		 */
		save: function ()
		{
			//
		}
	}
);