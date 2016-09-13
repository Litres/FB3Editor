/**
 * Загрузчик ресурсов с хаба.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.Loader',
	{
		extend : 'FBEditor.loader.Loader',
		requires: [
			'FBEditor.webworker.loadResources.Master'
		],

		/**
		 * @property {Boolean} Загружать ли ресурсы одновременно или по очереди.
		 */
		async: true,

		/**
		 * @property {Number} Максимальное количество одновременных запросов к хабу.
		 */
		maxAsyncRequests: 4,

		/**
		 * @property {Boolean} Использовать ли web workers для создания запросов.
		 */
		useWebWorkers: true,

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
		 * @private
		 * @property {Number} Счетчик полученных ответов на асинхронные запросы.
		 */
		countResponse: 0,

		/**
		 * @private
		 * @property {Number} Хранит количество одновременно открытых текущих запросов.
		 */
		countAsyncRequest: 0,

		/**
		 * Одновременно ли отправляются запросы на хаб.
		 * @return {Boolean}
		 */
		isAsync: function ()
		{
			return this.async;
		},

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
				wwManager = FBEditor.webworker.Manager,
				master,
				promise;

			// добавляем данные обложки
			data.unshift(
				{
					url: me.urlCover + '?art=' + me.getArt(),
					isCover: true
				}
			);

			// владелец потока
			master = wwManager.factory('loadResources');

			promise = new Promise(
				function (resolve, reject)
				{
					// отправляем запрос
					master.post(
						{
							callbackId: 'responseData',
							resourcesData: data,
							maxAsyncRequests: me.maxAsyncRequests,
							urlRes: me.urlRes,
							art: me.art
						},
						function (responseData)
						{
							var me = this,
								resource = {},
								statusOk = 200,
								manager = me.manager,
								resourcesData = responseData.resourcesData,
								indexRequest = responseData.indexResource,
								resData,
								msg;

							resData = resourcesData[indexRequest];

							if (responseData.status === statusOk)
							{
								// формируем данные для ресурса
								resource.content = responseData.response;
								resource.fileName = resData.isCover ? 'img/thumb.jpeg' : resData._Target;
								resource.fileId = resData._Id;
								resource.isCover = resData.isCover;

								// загружаем ресурс в редактор
								manager.addLoadedResource(resource);
							}
							else
							{
								msg = ' ' + responseData.status + ' (' + responseData.statusText + ')';

								Ext.log(
									{
										level: 'error',
										msg: 'Ошибка загрузки ресурса ' + resData.url + msg,
										dump: responseData
									}
								);
							}

							if (responseData.resolve)
							{
								// все ответы получены

								master.destroy();
								delete master;

								resolve();
							}
						},
						me
					);
				}
			);

			/*
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
			*/

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
		 * Загружает все ресурсы асинхронно с учетом максимального количества одновременных запросов
		 * в свойстве #maxAsyncRequests.
		 * @param {Array} data Список всех необходимых ресурсов.
		 */
		loadAsyncResources: function (data)
		{
			var me = this,
				promise;

			me.masterWorkers = [];

			// обнуляем счетчики
			me.countResponse = 0;
			me.countRequest = 0;
			me.countAsyncRequest = 0;

			promise = new Promise(
				function (resolve, reject)
				{
					// запрос
					me.requestResource(data, resolve, reject);
				}
			);

			return promise;
		},

		requestResource: function (data, resolve, reject)
		{
			var me = this,
				countRequest = me.countRequest,
				maxRequests = me.maxAsyncRequests,
				countAsyncRequest = me.countAsyncRequest,
				wwManager = FBEditor.webworker.Manager,
				master,
				resData,
				url;

			if (me.countResponse === data.length)
			{
				// все ответы получены
				resolve();
			}

			if (me.countRequest === data.length)
			{
				// все запросы отправлены
				return;
			}

			// если количество одновременно исполняемых запросов не превышает максимума
			if (countAsyncRequest < maxRequests)
			{
				//console.log('request', me.countRequest, resData);

				// увеличиваем счетчик общего количества отправленных запросов
				me.countRequest++;

				// увеличиваем счетчик одновременно исполняемых запросов
				me.countAsyncRequest++;

				// данные текущего запрашиваемого ресурса
				resData = data[countRequest];

				// формируем url для загрузки ресурса
				url = resData.url ? resData.url : me.urlRes + '?art=' + me.art + '&image=' + resData._Id;
				resData.url = url;

				if (me.useWebWorkers)
				{
					// владелец потока
					master = wwManager.factory('httpRequest');

					// сохраняем ссылку на владельца
					me.masterWorkers[countRequest] = master;

					// формируем запрос
					master.post(
						{
							url: url,
							responseType: 'arraybuffer',
							data: {
								res: resData,
								resources: data,
								indexRequest: countRequest
							}
						},
						function (response, responseData)
						{
							var me = this,
								resource = {},
								statusOk = 200,
								manager = me.manager,
								resData = responseData.data.res,
								resourcesData = responseData.data.resources,
								indexRequest = responseData.data.indexRequest,
								msg;

							// увеличиваем счетчик количества полученных ответов
							me.countResponse++;

							//console.log(me.countResponse, responseData);

							// уменьшаем счетчик одновременно исполняемых запросов
							me.countAsyncRequest--;

							if (response && responseData.status === statusOk)
							{
								// формируем данные файла для ресурса
								resource.content = response;
								resource.fileName = resData.isCover ? 'img/thumb.jpeg' : resData._Target;
								resource.fileId = resData._Id;
								resource.isCover = resData.isCover;

								// загружаем ресурс в редактор
								manager.addLoadedResource(resource);
							}
							else
							{
								msg = ' ' + responseData.status + ' (' + responseData.statusText + ')';

								Ext.log(
									{
										level: 'error',
										msg: 'Ошибка загрузки ресурса ' + resData.url + msg,
										dump: responseData
									}
								);
							}

							// удаляем отработанный поток
							me.masterWorkers[indexRequest].destroy();
							delete me.masterWorkers[indexRequest];

							// следующий запрос
							me.requestResource(resourcesData, resolve, reject);
						},
						me
					);
				}
				else
				{
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

								// увеличиваем счетчик общего количества полученных ответов
								me.countResponse++;

								//console.log(me.countResponse, resData, response);

								// уменьшаем счетчик одновременно исполняемых запросов
								me.countAsyncRequest--;

								if (response && response.responseBytes && response.status === statusOk)
								{
									// формируем данные файла для ресурса
									resource.content = response.responseBytes;
									resource.fileName = resData.isCover ? 'img/thumb.jpeg' : resData._Target;
									resource.fileId = resData._Id;
									resource.isCover = resData.isCover;

									// загружаем ресурс в редактор
									manager.addLoadedResource(resource);
								}
								else
								{
									msg = ' ' + response.status + ' (' + response.statusText + ')';

									Ext.log(
										{
											level: 'error',
											msg: 'Ошибка загрузки ресурса ' + resData.url + msg,
											dump: response
										}
									);
								}

								// следующий запрос
								me.requestResource(data, resolve, reject);
							},
							failure: function (response)
							{
								var me = this,
									msg;

								// увеличиваем счетчик общего количества полученных ответов
								me.countResponse++;

								// уменьшаем счетчик одновременно исполняемых запросов
								me.countAsyncRequest--;

								msg = ' ' + response.status + ' (' + response.statusText + ')';

								Ext.log(
									{
										level: 'error',
										msg: 'Ошибка загрузки ресурса ' + resData.url + msg,
										dump: response
									}
								);

								// следующий запрос
								me.requestResource(data, resolve, reject);
							}
						}
					);
				}

				// следующий запрос
				me.requestResource(data, resolve, reject);
			}

		}
	}
);