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

		save: function (resData)
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

			// данные для запроса
			form = new FormData();
			form.append('data', resData.blob);
			form.append('action', 'put_fb3_image');
			form.append('art', art);
			form.append('image', resData.name);

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

			return promise;
		}
	}
);