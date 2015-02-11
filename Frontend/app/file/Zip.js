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
		 * @return {Object} Распокованные данные архива.
		 */
		unPackage: function (data)
		{
			var me = this,
				zip = me.zip,
				unPackData;

			unPackData = zip.load(data);

			return unPackData;
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
		 * @return {Blob} Данные Blob.
		 */
		generateBlob: function ()
		{
			var me = this,
				zip = me.zip;

			return zip.generate({type: 'blob'});
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