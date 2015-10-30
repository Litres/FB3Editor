/**
 * Абстрактный класс владельца потока.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.webworker.AbstractMaster',
	{
		/**
		 * @property {String} Имя потока.
		 */
		name: '',

		/**
		 * @property {Boolean} Нужна ли инициализация потока перед использованием.
		 */
		needInit: false,

		/**
		 * @protected
		 * @property {Worker} Поток.
		 */
		worker: null,

		/**
		 * @protected
		 * @property {Object[]} Очередь функций обратного вызова при получении ответа от потока.
		 * Самая первая функция должна быть выполнена в первую очередь.
		 * @property {Function} Object.fn Функция.
		 * @property {Object} Object.scope Хозяин функции.
		 */
		callback: [],

		/**
		 * @property {Boolean} Инициализирован ли поток.
		 */
		initialized: false,

		constructor: function (cfg)
		{
			var me = this,
				manager = FBEditor.webworker.Manager,
				name,
				worker,
				callbackInit;

			// скрипт потока
			name = 'app/' + manager.path + '/' + me.name + '/Worker.js';

			try
			{
				worker = new Worker(name);
				worker.addEventListener('message', me.message, false);
				worker.addEventListener('error', me.error, false);

				me.worker = worker;

				if (me.needInit)
				{
					callbackInit = function (data)
					{
						me.initialized = data ? true : false;
						//console.log('init', data);
					};

					me.post(null, callbackInit, me);
				}
			}
			catch (e)
			{
				Ext.log({msg: 'Ошибка создания потока: ' + name, level: 'error'});
			}
		},

		/**
		 * @abstract
		 * Получает сообщение от потока и вызывает колбэк.
		 * @param res Объект ответа от потока.
		 * @param {String|Object} res.data Данные ответа.
		 */
		message: function (res)
		{
			throw Error('Не реализован метод webworker.AbstractMaster#message()');
		},

		/**
		 * @template
		 * Отправляет сообщение потоку.
		 * @param {String|Object} data Сообщение.
		 * @param {Function} callback Функция обратного вызова при получении ответа.
		 * @param {Object} scope Хозяин колбэк.
		 */
		post: function (data, callback, scope)
		{
			var me = this,
				worker = me.worker,
				name = me.name;

			me.callback[name] = me.callback[name] || [];
			me.callback[name].push({fn: callback, scope: scope});
			worker.postMessage(data);
		},

		/**
		 * Получает сообщение об ошибке потока.
		 * @param res Объект ответа от потока.
		 * @param {String} res.filename Название скрипта потока.
		 * @param {Number} res.lineno Номер строки.
		 * @param {String} res.message Описание ошибки.
		 */
		error: function (res)
		{
			throw Error('Не реализован метод webworker.AbstractMaster#error()');
		},

		/**
		 * Возвращает первый колбэк из очереди.
		 * @return {Function|null} Колбэк.
		 */
		getCallback: function ()
		{
			var me = this,
				name = me.name,
				callback = null;

			if (me.callback[name].length)
			{
				// первый колбэк
				callback = me.callback[name].splice(0, 1)[0];
			}

			return callback;
		}
	}
);