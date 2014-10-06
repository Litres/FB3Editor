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
		}
	}
);