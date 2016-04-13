/**
 * Абстрактное хранилище.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.store.AbstractStore',
	{
		/**
		 * @required
		 * @property {String} URL запроса.
		 */
		url: '',

		/**
		 * @property {String} Название корневого свойства в полученном ответе на запрос.
		 * В этом свойстве содержатся все данные.
		 * Если свойство не указано, то считается, что данные содержатся напрямую в теле ответа.
		 */
		rootProperty: null,

		/**
		 * @property {Array} Последние полученные данные хранилища.
		 */
		data: null,

		/**
		 * @private
		 * @property {Object} Параметры запроса.
		 */
		params: null,

		/**
		 * @private
		 * @property Данные колбэк-функции, вызываемой после загрузки данных в хранилище.
		 * @property {Function} callback.fn Функция.
		 * @property {Object} callback.scope Хозяин функции.
		 */
		callback: null,

		/**
		 * @private
		 * @property {Object} Кэш запросов.
		 */
		cacheData: {},

		setParams: function (data)
		{
			this.params = Ext.clone(data);
		},

		getParams: function ()
		{
			return this.params;
		},

		setCallback: function (data)
		{
			this.callback = data;
		},

		/**
		 * Загружает данные с сервера в хранилище.
		 */
		load: function ()
		{
			var me = this,
				manager = FBEditor.webworker.Manager,
				url = me.getUrl(),
				master;

			//console.log('to url', url, me.cacheData[url]);

			if (true/*!me.cacheData[url]*/) // TODO непонятная ошибка с кэшированием запросов
			{
				if (me._master)
				{
					// прерываем предыдущий поиск
					me.abort();
				}

				// создаем поток
				master = manager.factory('httpRequest');
				me._master = master;

				// запрос на поиск
				master.post(
					{
						callbackId: me.url,
						url: url
					},
					function (response, data)
					{
						var json;

						//console.log('load', data);

						json = response ? JSON.parse(response) : null;

						if (json && me.rootProperty)
						{
							json = json[me.rootProperty] ? json[me.rootProperty] : null;
						}

						// кэшируем данные
						me.cacheData[url] = json;

						//console.log('from url', url, json);
						me.data = json;
						me.afterLoad(json);
					},
				    me
				);
			}
			else
			{
				me.data = me.cacheData[url];
				me.afterLoad(me.data);
			}
		},

		/**
		 * Загружает данные напрямую в хранилище.
		 * @param {Array} data Данные.
		 */
		loadData: function (data)
		{
			var me = this;

			me.data = data || null;
			me.afterLoad(data);
		},

		/**
		 * Вызывается после загрузки данных в хранилище.
		 * @param {Object} data Данные.
		 */
		afterLoad: function (data)
		{
			var me = this,
				callback = me.callback;

			if (callback)
			{
				callback.fn.apply(callback.scope, [data]);
			}
		},

		/**
		 * Прерывает выполнение запроса.
		 */
		abort: function ()
		{
			var me = this;

			if (me._master)
			{
				me._master.abort();
			}
		},

		/**
		 * Возвращает URL для запроса.
		 * @return {string} URL.
		 */
		getUrl: function ()
		{
			var me = this,
				params = me.params,
				url = me.url;

			if (params)
			{
				url += '?';

				Ext.Object.each(
					params,
					function (key, val)
					{
						var v;

						v = encodeURI(val);
						url += key + '=' + v + '&';
					}
				);

				url = url.trim('&');
			}

			return url;
		},

		/**
		 * Возвращает запись из хранилища.
		 * @param {String} key Свойство записи.
		 * @param {*} val Значение свойства.
		 * @return {Object} Данные записи.
		 */
		getRecord: function (key, val)
		{
			var me = this,
				data = me.data,
				record = null;

			if (data)
			{
				Ext.Array.each(
					data,
				    function (item)
				    {
					    if (item[key] && item[key] == val)
					    {
						    record = item;

						    return false;
					    }
				    }
				)
			}

			return record;
		}
	}
);