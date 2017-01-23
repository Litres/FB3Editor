/**
 * Загружает xmllint и проверят документы xml по схеме.
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

			// загружаем xmllint
			self.importScripts('lib/index.js');

			me.data = true;

			me.post();
		},

		/**
		 * Обрабатывает полученные данные от владельца.
		 * @param data Данные.
		 * @param {String} data.valid Сообщение.
		 * @param {Boolean} data.res Успешна ли проверка.
		 */
		message: function (data)
		{
			var me = this;

			me.data = data;

			if (self.validateXML)
			{
				// xmllint уже загружен
				me.valid();
				data.loaded = true;
			}
			else
			{
				data.valid = 'xmllint не загружен';
				data.res = false;
				data.loaded = false;
			}

			me.post();
		},

		/**
		 * Отправляет результат владельцу потока.
		 */
		post: function ()
		{
			var me = this,
				res;

			res = {
				masterName: 'xmllint',
				data: me.data
			};

			self.postMessage(res);
		},

		/**
		 * Проверяет xml по схеме.
		 * Результаты сохраняет в #data.
		 */
		valid: function ()
		{
			var me = this,
				data = me.data,
				reg,
				valid,
				module,
				res;

			module = {
				xml: data.xml,
				schema: data.xsd,
				arguments: ["--noout", "--schema", data.schemaFileName, data.xmlFileName]
			};

			valid = validateXML(module);

			// признак ошибки
			reg = new RegExp('^(' + data.schemaFileName + '|' + data.xmlFileName + '):[0-9]+', 'i');
			res = !reg.test(valid);

			// сохраняем результат проверки
			data.valid = valid;
			data.res = res;
		}
	}
}
