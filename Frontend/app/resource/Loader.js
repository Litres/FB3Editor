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
		 * @property {String} Адрес загрузки списка ресурсов.
		 */
		loadAction: 'https://hub.litres.ru/pages/get_fb3_body_rels/',
		
		/**
		 * @private
		 * @property {String} Адрес загрузки ресурса.
		 */
		urlRes: 'https://hub.litres.ru/pages/get_fb3_body_image/',

		/**
		 * @private
		 * @property {String} Адрес загрузки обложки.
		 */
		urlCover: 'https://hub.litres.ru/pages/get_fb3_cover_image/',

		/**
		 * @property {Number} Максимальное количество одновременных запросов к хабу.
		 */
		maxAsyncRequests: 4,

		/**
		 * @param {Object} resData Данные ресурса.
		 * @param {String} [target] Новый путь хранения ресурса. Если передан, то ресурс перемещается.
		 */
		save: function (resData, target)
		{
			var me = this,
				art = me.getArt(),
				url,
				form,
				promise;

			url = me.getSaveUrl();

			Ext.log(
				{
					level: 'info',
					msg: 'Сохранение ресурса на ' + url
				}
			);

			//console.log(resData);

			// данные для запроса
			form = new FormData();
			form.append('data', resData.blob);
			form.append('action', 'put_fb3_image');
			form.append('art', art);
			form.append('image', resData.name);
			form.append('target', target || resData.rootName);

			promise = new Promise(
				function (resolve, reject)
				{
					// формируем запрос
					FBEditor.util.Ajax.request(
						{
							url: url,
							data: form,
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
		 * Удаляет ресурс.
		 * @param {String} id Уникальный ID ресурса в body.rels.
		 * @return {Promise}
		 */
		remove: function (id)
		{
			var me = this,
				art = me.getArt(),
				url,
				promise;

			url = me.getSaveUrl();

			Ext.log(
				{
					level: 'info',
					msg: 'Удаление ресурса на ' + url
				}
			);

			promise = new Promise(
				function (resolve, reject)
				{
					// формируем запрос
					Ext.Ajax.request(
						{
							url: url,
							params: {
								action: 'put_fb3_image',
								art: art,
								image: id
							},
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
		 * Перемещает ресурс.
		 * @param {FBEditor.resource.Resource} resource Объект ресурса.
		 * @param {String} newName Новый путь ресурса.
		 * @return {Promise}
		 */
		move: function (resource, newName)
		{
			var me = this,
				promise,
				target;

			target = newName;
			promise = me.remove(resource.fileId).then(
				function (xml)
				{
					resource.rename(newName);
					return me.save(resource, target);
				}
			);

			return promise;
		},

		/**
		 * Загружает список ресурсов.
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
					// формируем запрос
					Ext.Ajax.request(
						{
							url: url,
							disableCaching: true,
							scope: me,
							success: function(response)
							{
								var xml;

								//console.log(response);
								
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

			return promise;
		},

		/**
		 * Последовательно сохраняет ресурсы.
		 * @param {FBEditor.resource.Resource[]} resources Ресурсы.
		 * @return {Promise}
		 */
		saveResources: function (resources)
		{
			var me = this,
				res,
				promise;

			res = resources.pop();

			promise = new Promise(
				function (resolve, reject)
				{
					if (res)
					{
						me.save(res).then(
							function (xml)
							{
								if (!resources.length)
								{
									resolve(xml);
								}

								// обновляем элементы
								res.updateElements();

								// продолжаем сохранять ресурсы
								me.saveResources(resources).then(
									function (xml)
									{
										resolve(xml);
									},
									function ()
									{
										reject();
									}
								);
							},
							function ()
							{
								reject();
							}
						);
					}
				}
			);

			return promise;
		},

		/**
		 * Последовательно удаляет ресурсы.
		 * @param {FBEditor.resource.Resource[]} resources Ресурсы.
		 * @return {Promise}
		 */
		removeResources: function (resources)
		{
			var me = this,
				res,
				promise;

			res = resources.pop();

			promise = new Promise(
				function (resolve, reject)
				{
					if (res)
					{
						me.remove(res.fileId).then(
							function (xml)
							{
								if (!resources.length)
								{
									resolve(xml);
								}

								// продолжаем удалять ресурсы
								me.removeResources(resources).then(
									function (xml)
									{
										resolve(xml);
									},
									function ()
									{
										reject();
									}
								);
							},
							function ()
							{
								reject();
							}
						);
					}
				}
			);

			return promise;
		},

		/**
		 * Получает target обложки.
		 * @return {Promise}
		 */
		getCover: function ()
		{
			var me = this,
				url,
				promise;

			url = me.urlCover + '?art=' + me.getArt();

			promise = new Promise(
				function (resolve, reject)
				{
					Ext.Ajax.request(
						{
							url: url,
							disableCaching: true,
							scope: me,
							success: function(response)
							{
								var target;

								//console.log(response);

								if (response && response.responseText && /^\/fb3/ig.test(response.responseText))
								{
									target = response.responseText;
									resolve(target);
								}
								else
								{
									resolve(false);
								}
							},
							failure: function (response)
							{
								resolve(false);
							}
						}
					);
				}
			);

			return promise
		},

		/**
		 * Устанавливает ресурс на обложку.
		 * @param {Object} [resData] Данные ресурса. Если данные не переданы, то обложка снимается.
		 * @returns {Promise}
		 */
		setCover: function (resData)
		{
			var me = this,
				params,
				url,
				promise;

			params = {
				action: 'put_fb3_cover'
			};

			console.log(resData);

			if (resData)
			{
				params.body_image_id = resData.fileId;
			}

			url = me.getSaveUrl(params);

			Ext.log(
				{
					level: 'info',
					msg: 'Запрос на обложку ' + url
				}
			);

			//console.log(resData);

			promise = new Promise(
				function (resolve, reject)
				{
					// формируем запрос
					Ext.Ajax.request(
						{
							url: url,
							disableCaching: true,
							scope: me,
							success: function(response)
							{
								var xml;

								resolve(response);

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
		 * Сбрасывает обложку.
		 */
		resetCover: function ()
		{
			var me = this;

			me.setCover().then(
				function (res)
				{

				}
			);
		}
	}
);