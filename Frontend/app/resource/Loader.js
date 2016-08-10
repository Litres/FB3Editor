/**
 * Загрузчик ресурсов с хаба.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.Loader',
	{
		extend : 'FBEditor.loader.Loader',
		
		/**
		 * @property {String} Адрес загрузки/сохранения.
		 */
		url: 'https://hub.litres.ru/pages/get_fb3_body_rels/',

		/**
		 * @private
		 * @property {String} Адрес загрузки/сохранения ресурса.
		 */
		urlRes: 'https://hub.litres.ru/pages/get_fb3_body_image/',

		/**
		 * @private
		 * @property {String} Адрес загрузки/сохранения обложки.
		 */
		urlCover: 'https://hub.litres.ru/pages/get_fb3_cover_image/',

		/**
		 * @private
		 * @property {Array} Стек данных уже загруженных ресурсов.
		 */
		loadedDataResources: [],

		/**
		 * Загружает описание.
		 * @param {Number} [art] Айди произведениея на хабе.
		 * @return {Promise}
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
					msg: 'Загрузка ресурсов из ' + url
				}
			);

			promise = new Promise(
				function (resolve, reject)
				{
					Ext.Ajax.request(
						{
							url: url,
							scope: me,
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
		 * Загружает ресурсы.
		 * @param {Array} data Данные ресурсов.
		 * @return {Promise}
		 */
		loadResources: function (data)
		{
			var me = this,
				promise;

			// добавляем данные обложки
			data.unshift(
				{
					url: me.urlCover + '?art=' + me.getArt(),
					isCover: true
				}
			);

			// загружаем ресурсы по порядку, начиная с первого
			promise = me.loadResource(data, 0);

			return promise;
		},

		/**
		 * Загружает ресурс.
		 * @param {Array} data Список всех необходимых ресурсов.
		 * @param {Number} index Порядковый номер загружаемого ресурса.
		 */
		loadResource: function (data, index)
		{
			var me = this,
				item = data[index],
				url,
				promise;

			// формируем url для загрузки ресурса
			url = item.url ? item.url : me.urlRes + '?art=' + me.art + '&image=' + item._Id;
			item.url = url;

			promise = new Promise(
				function (resolve, reject)
				{
					// формируем запрос
					Ext.Ajax.request(
						{
							url: url,
							scope: me,
							binary: true,
							success: function(response)
							{
								var resource = {},
									statusOk = 200,
									res,
									msg;

								//console.log(index, data.length, response);

								if (response && response.responseBytes && response.status === statusOk)
								{
									// формируем данные файла для ресурса
									resource.content = response.responseBytes;
									resource.fileName = item.isCover ? 'img/thumb.jpeg' : item._Target;
									resource.fileId = item._Id;
									resource.isCover = item.isCover;

									res = Ext.create('FBEditor.resource.data.UrlData', resource);

									// стек уже загруженных ресурсов
									me.addLoadedDataResources(res);
								}
								else
								{
									msg = ' ' + response.status + ' (' + response.statusText + ')';

									Ext.log(
										{
											level: 'error',
											msg: 'Ошибка загрузки ресурса ' + item.url + msg,
											dump: response
										}
									);
								}

								if (index + 1 < data.length)
								{
									// загружаем следующий ресурс
									resolve(me.loadResource(data, index + 1));
								}
								else
								{
									// все ресурсы были загружены
									resolve();
								}
							},
							failure: function (response)
							{
								var me = this;

								if (index + 1 < data.length)
								{
									// пробуем загрузить следующий ресурс
									resolve(me.loadResource(data, index + 1));
								}
								else
								{
									// все ресурсы были загружены
									resolve();
								}
							}
						}
					);
				}
			);

			return promise;
		},

		/**
		 * Возвращает стек загруженных данных ресурсов.
		 * @return {Array}
		 */
		getLoadedDataResources: function ()
		{
			return this.loadedDataResources;
		},

		/**
		 * @private
		 * Обнуляет стек загруженных ресурсов.
		 */
		cleanLoadedDataResources: function ()
		{
			this.loadedDataResources = [];
		},

		/**
		 * @private
		 * Добавляет данные ресурса в стек уже загруженных ресурсов.
		 * @param resource
		 */
		addLoadedDataResources: function (resource)
		{
			var me = this;

			me.loadedDataResources.push(resource);
		}
	}
);