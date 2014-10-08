/**
 * Файл FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.File',
	{
		/**
		 * @property {FBEditor.file.Zip} Zip-Архиватор.
		 */
		zip: null,

		/**
		 * @property {FBEditor.FB3.Structure} Структура архива FB3.
		 */
		structure: null,

		/**
		 * @property {Object} Файлы архива.
		 */
		files: null,

		/**
		 * Распаковывает файл.
		 * @param {ArrayBuffer} data Нераспакованные данные.
		 */
		constructor: function (data)
		{
			var me = this,
				zip = Ext.create('FBEditor.file.Zip');

			me.zip = zip;
			zip.unPackage(data);
			me.files = zip.getFiles();
			me.structure = Ext.create('FBEditor.FB3.Structure', me);
		},

		/**
		 * Возвращает файлы архива или конкретный файл по переданному имени.
		 * @param {String} [name] Имя файла.
		 * @return {Object} Файлы или один файл.
		 */
		getFiles: function (name)
		{
			var me = this,
				result;

			result = name ? me.files[name] : me.files;
			result = result || null;

			return result;
		}
	}
);