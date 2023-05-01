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
		loadAction: Ext.manifest.hubApiEndpoint + '/pages/get_fb3_body_rels/',
		
		/**
		 * @private
		 * @property {String} Адрес загрузки ресурса.
		 */
		urlRes: Ext.manifest.hubApiEndpoint + '/pages/get_fb3_body_image/',

		/**
		 * @private
		 * @property {String} Адрес загрузки обложки.
		 */
		urlCover: Ext.manifest.hubApiEndpoint + '/pages/get_fb3_cover_image/',

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
				csrf = FBEditor.csrf.Csrf,
				saveUrl,
				pImage,
				pTarget,
				form,
				promise;

			//console.log(resData);

			promise = new Promise(
				function (resolve, reject)
				{
					me.getSaveUrl().then(
						function (url)
						{
							saveUrl = url;

							return csrf.getToken();
						}
					).then(
						function (token)
						{
							Ext.log({level: 'info', msg: 'Сохранение ресурса на ' + saveUrl});

							pImage = resData.name;
							pTarget = target || resData.rootName;
							pImage = encodeURI(pImage);
							pTarget = encodeURI(pTarget);

							// данные для запроса
							form = new FormData();
							form.append('data', resData.blob);
							form.append('action', 'put_fb3_image');
							form.append('art', art);
							form.append('image', pImage);
							form.append('target', pTarget);
							form.append('csrf', token);

							FBEditor.util.Ajax.request(
								{
									url: saveUrl,
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
				csrf = FBEditor.csrf.Csrf,
				removeUrl,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					me.getSaveUrl().then(
						function (url)
						{
							removeUrl = url;

							return csrf.getToken();
						}
					).then(
						function (token)
						{
							Ext.log({level: 'info', msg: 'Удаление ресурса на ' + removeUrl});

							Ext.Ajax.request(
								{
									url: removeUrl,
									params: {
										action: 'put_fb3_image',
										art: art,
										image: encodeURI(id),
										csrf: token
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
				promise;

			if (art)
			{
				// устанавливаем айди произведения
				me.setArt(art);
			}

			promise = new Promise(
				function (resolve, reject)
				{
					me.getLoadUrl().then(
						function (url)
						{
							Ext.log({level: 'info', msg: 'Загрузка ресурсов из ' + url});

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
				}
			);

			return promise;
		},

		/**
		 * Загружает ресурсы.
		 * @event beforeLoadResources
		 * @event afterLoadResources
		 * @param {Array} data Данные ресурсов.
		 * @return {Promise}
		 */
		loadResources: function (data)
		{
			var me = this,
				observer = me.getObserver(),
				wwManager = FBEditor.webworker.Manager,
				master,
				promise;

			// выбрасываем событие для наблюдателей
			observer.fireEvent('beforeLoadResources');

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

							//console.log('responseData', responseData);

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

								// выбрасываем событие для наблюдателей
								observer.fireEvent('afterLoadResources');

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
				manager = me.manager,
				res,
				promise;

			res = resources.pop();

			promise = new Promise(
				function (resolve, reject)
				{
					if (res)
					{
						//console.log('res', res);
						res.load().then(
							function ()
							{
								return me.save(res);
							}
						).then(
							function (xml)
							{
								manager.addResource(res);

								// обновляем элементы
								res.updateElements();

								if (!resources.length)
								{
									resolve(xml);
								}

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
				manager = me.manager,
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
								// синхронизируем ресурсы с хабом
								manager.syncResources(xml);
								
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
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					var url;

					url = me.urlCover + '?art=' + me.getArt();

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
									target = decodeURI(response.responseText);
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
				csrf = FBEditor.csrf.Csrf,
				coverUrl,
				params,
				promise;

			//console.log(resData);

			promise = new Promise(
				function (resolve, reject)
				{
					me.getSaveUrl().then(
						function (url)
						{
							coverUrl = url;

							return csrf.getToken();
						}
					).then(
						function (token)
						{
							Ext.log({level: 'info', msg: 'Запрос на установку обложку ' + coverUrl});

							params = {
								action: 'put_fb3_cover',
								art: me.getArt(),
								csrf: token
							};

							if (resData)
							{
								params.body_image_id = encodeURI(resData.fileId);
							}

							Ext.Ajax.request(
								{
									url: coverUrl,
									disableCaching: true,
									scope: me,
									params: params,
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
					//
				}
			);
		}
	}
);
