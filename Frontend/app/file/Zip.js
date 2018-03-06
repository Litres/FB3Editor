/**
 * Zip-Архиватор (адаптер над JSZip).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.file.Zip',
	{
		/**
		 * @property {JSZip} Сторонняя библиотека для работы с zip-архивами.
		 */
		zip: null,

		/**
		 * Инициализирует архиватор.
		 */
		constructor: function ()
		{
			var me = this;

			me.zip = new JSZip();
		},

		/**
		 * Распаковывает архив.
		 * @param {ArrayBuffer} data Нераспокованные данные архива.
		 * @resolve {Object} Распокованные данные архива.
		 * @return {Promise}
		 */
		unPackage: function (data)
		{
			var me = this,
				zip = me.zip,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
                    zip.loadAsync(data).then(
                    	function (unpackData)
						{
							resolve(unpackData);
						}
					).catch(
						function (e)
						{
							reject(e);
						}
					);
				}
			);

			return promise;
		},

		/**
		 * Возвращает файлы архива.
		 * @return {Object}
		 */
		getFiles: function ()
		{
			var me = this,
				zip = me.zip;

			return zip.files;
		},

		/**
		 * Генерирует архив в Blob.
		 * @resolve {Blob} Данные Blob.
		 * @return {Promise}
		 */
		generateBlob: function ()
		{
			var me = this,
				zip = me.zip,
				promise;

			promise = new  Promise(
				function (resolve, reject)
				{
                    zip.generateAsync({type: 'blob'}).then(
                    	function (blob)
						{
							resolve(blob);
						}
					);
				}
			);

			return promise;
		},

		/**
		 * Добавляет или обновляет файл в архиве.
		 * @param {String} name Имя файла.
		 * @param {String/ArrayBuffer/Uint8Array/Buffer} data Содержимое файла
		 * @param {Object} options Опции.
		 */
		file: function (name, data, options)
		{
			var me = this,
				zip = me.zip;

			// удаляем первый слеш
			name = name.replace(/^\//, '');
			
			zip.file(name, data, options);
		},

		/**
		 * Удаляет файл или директорию.
		 * @param {String} name Имя файла или директории.
		 */
		remove: function (name)
		{
			var me = this,
				zip = me.zip;

			zip.remove(name);
		}
	}
);