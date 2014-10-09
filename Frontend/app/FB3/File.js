/**
 * Файл FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.File',
	{
		/**
		 * @private
		 * @property {Object} Файлы архива.
		 */
		files: null,

		/**
		 * @private
		 * @property {FBEditor.FB3.Structure} Структура архива FB3.
		 */
		structure: null,

		/**
		 * @private
		 * @property {FBEditor.file.Zip} Zip-Архиватор.
		 */
		zip: null,

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
		 * Возвращает структуру архива FB3.
		 * @return {FBEditor.FB3.Structure} Структура архива FB3.
		 */
		getStructure: function ()
		{
			var me = this;

			return me.structure;
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
			if (!result)
			{
				Ext.log(
					{
						level: 'warn',
						msg: 'В архиве отсутствует файл ' + name + ', на который ссылается один из существующих файлов',
						dump: me.files
					}
				);
			}

			return result;
		}
	}
);