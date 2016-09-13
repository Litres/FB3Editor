/**
 * Отправляет запросы на хаб для загрузки ресурсов.
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
		 */
		message: function (data)
		{
			var me = this;

			me.data = data;
			me.data.countResponse = 0;
			me.data.countRequest = 0;
			me.data.countAsyncRequest = 0;

			// загружаем ресурсы
			me.loadResource();
		},

		/**
		 * Отправляет результат владельцу потока.
		 */
		post: function ()
		{
			var me = this,
				res;

			res = {
				masterName: 'loadResources',
				data: me.data
			};

			self.postMessage(res);
		},

		/**
		 * Загружает ресурс.
		 */
		loadResource: function ()
		{
			var me = this,
				data = me.data,
				countRequest = data.countRequest,
				resourcesData = data.resourcesData,
				resData,
				url;

			if (data.countRequest === resourcesData.length)
			{
				// все запросы отправлены
				return;
			}

			if (data.countAsyncRequest < data.maxAsyncRequests)
			{
				// увеличиваем счетчик общего количества отправленных запросов
				data.countRequest++;

				// увеличиваем счетчик одновременно исполняемых запросов
				data.countAsyncRequest++;

				// данные текущего запрашиваемого ресурса
				resData = data.resourcesData[countRequest];

				// формируем url для загрузки ресурса
				url = resData.url ? resData.url : data.urlRes + '?art=' + data.art + '&image=' + resData._Id;
				resData.url = url;

				//console.log(url);

				// отправляем запрос
				me.send(url);

				// следующий ресурс
				me.loadResource();
			}
		},

		/**
		 * Отправляет запрос.
		 * @param {String} url Адрес ресурса на хабе.
		 */
		send: function (url)
		{
			var me = this,
				data = me.data,
				resourcesData = data.resourcesData,
				transport;

			url = url + '&_d=' + new Date().getTime();
			transport = me.getXmlHttp();
			transport.open('GET', url, true);
			
			// сохраняем индекс ресурса
			transport.indexResource = data.countRequest - 1;

			// тип возвращаемых данных
			if (Uint8Array)
			{
				transport.responseType = 'arraybuffer';
			}
			else if (transport.overrideMimeType)
			{
				// для старых браузеров
				transport.overrideMimeType('text\/plain; charset=x-user-defined');
			}

			transport.onreadystatechange = function ()
			{
				if (transport.readyState == 4)
				{
					data.response = transport.response;
					data.status = transport.status;
					data.statusText = transport.statusText;
					data.indexResource = transport.indexResource;

					// увеличиваем счетчик количества полученных ответов
					data.countResponse++;

					// уменьшаем счетчик одновременно исполняемых запросов
					data.countAsyncRequest--;

					// все ответы получены
					data.resolve = data.countResponse === resourcesData.length;

					// возвращаем ответ в главный процесс
					me.post();

					if (!data.resolve)
					{
						// следующий ресурс
						me.loadResource();
					}
				}
			};

			transport.send();
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
