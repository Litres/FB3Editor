/**
 * Утилита для Ajax запросов..
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.util.Ajax',
	{
		singleton: true,

		/**
		 * Отправляет запрос.
		 * @param {Object} options
		 * @param {String} options.url
		 * @param {Function} [options.callback]
		 * @param {Function} [options.success]
		 * @param {Function} [options.failure]
		 * @param {String} [options.method]
		 * @param {String} [options.responseType]
		 * @param {Boolean} [options.async]
		 * @param {Object} [options.data]
		 * @param {Object} [options.scope]
		 */
		request: function (options)
		{
			var me = this,
				time,
				transport;

			time = new Date().getTime();
			options.url += /[?]/.test(options.url) ? '&_d=' + time : '?_d=' + time;
			options.method = options.method || (options.data ? 'POST' : 'GET');
			options.async = options.async || true;
			options.data = options.data || null;
			
			transport = me.xhr();
			transport.open(options.method, options.url, options.async);

			// тип возвращаемых данных
			transport.responseType = options.responseType || 'text';

			// если двоичные данные
			if (options.responseType === 'arraybuffer')
			{
				if (Uint8Array)
				{
					transport.responseType = 'arraybuffer';
				}
				else if (transport.overrideMimeType)
				{
					// для старых браузеров
					transport.overrideMimeType('text\/plain; charset=x-user-defined');
				}
			}

			transport.onreadystatechange = function ()
			{
				var statusOK = 200,
					callback,
					success,
					failure;

				if (transport.readyState == 4)
				{
					callback = options.callback;
					success = options.success;
					failure = options.failure;

					if (transport.status == statusOK && success)
					{
						success.call(options.scope, transport);
					}
					else if (failure)
					{
						failure.call(options.scope, transport);
					}
					else
					{
						callback.call(options.scope, transport);
					}
				}
			};

			transport.send(options.data);
		},

		/**
		 * Возвращает объект запроса.
		 * @return {Object}
		 */
		xhr: function ()
		{
			try
			{
				return new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e)
			{
				try
				{
					return new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (ee)
				{
					//
				}
			}

			if (typeof XMLHttpRequest !== undefined)
			{
				return new XMLHttpRequest();
			}
		}
	}
);