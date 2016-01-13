/**
 * Отправляет запрос ajax.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

addEventListener(
	'message',
	function (e)
	{
		var data = e.data,
			worker;

		// получаем объект класса
		worker = self._worker || new W();
		self._worker = worker;

		if (!data)
		{
			// инициализируем
			worker.init();
		}
		else
		{
			// обрабатываем полученные данные
			worker.message(data);
		}
	},
	false
);

/**
 * Класс для работы с потоком.
 */
function W ()
{
	return {

		data: null,

		/**
		 * Инициализирует поток.
		 */
		init: function ()
		{
			var me = this;

			me.data = true;

			me.post();
		},

		/**
		 * Обрабатывает полученные данные от владельца.
		 * @param data Данные.
		 * @param {String} [data.url] Адрес сервера.
		 * @param {String} [data.method] Метод отправки данных (GET|POST).
		 * @param {Boolean} [data.abort] Прервать ли запрос.
		 */
		message: function (data)
		{
			var me = this;

			me.data = data;

			if (data.abort)
			{
				// прерываем запрос
				me.abort();
			}
			else
			{
				// делаем запрос
				me.send();
			}
		},

		/**
		 * Отправляет результат владельцу потока.
		 */
		post: function ()
		{
			var me = this,
				res;

			res = {
				masterName: 'httpRequest',
				data: me.data
			};

			self.postMessage(res);
		},

		/**
		 * Отправляет запрос.
		 */
		send: function ()
		{
			var me = this,
				data = me.data,
				time,
				transport;

			data.method = data.method || 'GET';
			time = new Date().getTime();
			data.url += /[?]/.test(data.url) ? '&_d=' + time : '?_d=' + time;

			transport = me.getXmlHttp();
			self._transport = transport;
			transport.open(data.method, data.url, true);

			transport.onreadystatechange = function ()
			{
				if (transport.readyState == 4)
				{
					data.response = transport.response;
					me.post();
				}
			};

			transport.send();
		},

		/**
		 * Прерывает запрос.
		 */
		abort: function ()
		{
			var me = this,
				transport;

			transport = self._transport;

			if (transport)
			{
				me.data.state = transport.readyState;
				transport.abort();
				//me.post();
			}
		},

		/**
		 * Возвращает объект запроса.
		 * @return {Object}
		 */
		getXmlHttp: function ()
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
}
