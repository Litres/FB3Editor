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
		 * Если свойство не указано, то считается, что данные содержаться напрямую в теле ответа.
		 */
		rootProperty: null,

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
		 * @property {Array} Данные хранилища.
		 */
		data: null,

		setParams: function (data)
		{
			this.params = data;
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

			//console.log('url', url);

			// владелец потока
			master = manager.factory('httpRequest');

			// запрос на поиск персон
			master.post(
				{
					url: url
				},
				function (response, data)
				{
					var json;

					json = response ? JSON.parse(response) : null;

					if (json && me.rootProperty)
					{
						json = json[me.rootProperty] ? json[me.rootProperty] : null;
					}

					me.data = json;
					me.afterLoad(json);
				}
			);
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
						url += key + '=' + val + '&';
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