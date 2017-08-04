/**
 * Список токенов для защиты от уязвимости CSRF.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.csrf.Csrf',
	{
		singleton: true,

		/**
		 * @property {String} Адрес списка токенов.
		 */
		url: 'https://hub.litres.ru/pages/get_some_csrfs/',

		/**
		 * @property {Number} Необходимое количество токенов.
		 */
		num: 1,

		/**
		 * @private
		 * @property {Object} Токены.
		 * @property {String} Object.csrf Токен
		 * @property {Object} Object.csrfs Список токенов.
		 */
		data: null,

		/**
		 * @private
		 * @property {Boolean} Был ли уже получен ответ на запрос токенов.
		 */
		received: false,

		/**
		 * Получает список токенов.
		 * @return {Promise}
		 */
		init: function ()
		{
			var me = this,
				url = me.url,
				num = me.num,
				promise;

			url = url + '?num=' + num;

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
								var html,
									js;

								me.received = true;

								html = response && response.responseText ? response.responseText : null;

								if (html && /var GUAjaxData/ig.test(html))
								{
									try
									{
										// вырезаем переносы
										html = html.replace(/\n/g, ' ');

										// получаем код js в скобочных группах
										js = html.match(/<script.*?>(.*?)<\/script>/i);

										if (js && js[1])
										{
											// выполняем полученный код и получаем локальную переменную GUAjaxData,
											// в которой находятся токены
											eval(js[1]);

											//console.log('GUAjaxData', GUAjaxData);

											if (GUAjaxData)
											{
												// сохраняем токены
												me.data = GUAjaxData;

												resolve();
											}
										}
									}
									catch (e)
									{
										//reject(response);
									}
								}
								else
								{
									//reject(response);
								}

							},
							failure: function (response)
							{
								me.received = true;
							}
						}
					);
				}
			);

			return promise;
		},

		/**
		 * Возвращает один токен.
		 * @return {String}
		 */
		getToken: function ()
		{
			var me = this,
				data = me.data,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					if (me.isReceived() && data.csrf)
					{
						resolve(data.csrf);
					}
					else
					{
						Ext.defer(
							function ()
							{
								this.getToken().then(
									function (token)
									{
										resolve(token);
									}
								);
							},
						    100,
							me
						);
					}
				}
			);

			return promise;
		},

		/**
		 * Возвращает список токенов.
		 * @return {Object}
		 */
		getTokens: function ()
		{
			var me = this,
				data = me.data,
				tokens;

			tokens = data.csrfs || null;

			return tokens;
		},

		/**
		 * Был ли уже получен ответ на запрос токенов.
		 * @return {Boolean}
		 */
		isReceived: function ()
		{
			return this.received;
		}
	}
);