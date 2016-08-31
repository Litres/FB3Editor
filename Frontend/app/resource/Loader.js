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
		 * @property {Boolean} Загружать ли ресурсы одновременно или по очереди.
		 */
		async: true,
		
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
		 * @property {Number} Счетчик отправленных асинхронных запросов на хаб.
		 */
		countRequest: 0,

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

			if (me.async)
			{
				// загружаем ресурсы одновременно
				promise = me.loadAsyncResources(data);
			}
			else
			{
				// загружаем ресурсы по порядку, начиная с первого
				promise = me.loadResource(data, 0);
			}

			return promise;
		},

		/**
		 * @private
		 * Загружает ресурс последовательно.
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
								var me = this,
									resource = {},
									statusOk = 200,
									manager = me.manager,
									msg;

								//console.log(index, data.length, response);

								if (response && response.responseBytes && response.status === statusOk)
								{
									// формируем данные файла для ресурса
									resource.content = response.responseBytes;
									resource.fileName = item.isCover ? 'img/thumb.jpeg' : item._Target;
									resource.fileId = item._Id;
									resource.isCover = item.isCover;

									// загружаем ресурс в редактор
									manager.addLoadedResource(resource);
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
		 * @private
		 * Загружает все ресурсы одновременно.
		 * @param {Array} data Список всех необходимых ресурсов.
		 */
		loadAsyncResources: function (data)
		{
			var me = this,
				url,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					me.countRequest = 0;

					Ext.Array.each(
						data,
						function (item)
						{
							// формируем url для загрузки ресурса
							url = item.url ? item.url : me.urlRes + '?art=' + me.art + '&image=' + item._Id;
							item.url = url;

							// формируем запрос
							Ext.Ajax.request(
								{
									url: url,
									scope: me,
									binary: true,
									success: function(response)
									{
										var me = this,
											resource = {},
											statusOk = 200,
											manager = me.manager,
											msg;

										me.countRequest++;
										//console.log(me.countRequest, response);

										if (response && response.responseBytes && response.status === statusOk)
										{
											// формируем данные файла для ресурса
											resource.content = response.responseBytes;
											resource.fileName = item.isCover ? 'img/thumb.jpeg' : item._Target;
											resource.fileId = item._Id;
											resource.isCover = item.isCover;

											// загружаем ресурс в редактор
											manager.addLoadedResource(resource);
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

										if (me.countRequest === data.length)
										{
											// все запросы отработаны
											resolve();
										}
									},
									failure: function (response)
									{
										var me = this,
											msg;

										me.countRequest++;

										msg = ' ' + response.status + ' (' + response.statusText + ')';

										Ext.log(
											{
												level: 'error',
												msg: 'Ошибка загрузки ресурса ' + item.url + msg,
												dump: response
											}
										);

										if (me.countRequest === data.length)
										{
											// все запросы отработаны
											resolve();
										}
									}
								}
							);
						}
					);
				}
			);

			return promise;
		}
	}
);