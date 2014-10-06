/**
 * Файл.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.file.File',
	{
		/**
		 * @const {String} Считывать файл как текст.
		 */
		LOAD_TYPE_TEXT: 'text',

		/**
		 * @const {String} Считывать файл как двоичные данные.
		 */
		LOAD_TYPE_ARRAYBUFFER: 'arraybuffer',

		/**
		 * @property {File} Объект файла из FileAPI.
		 */
		file: null,

		/**
		 * @property {FileReader} Объект чтения файла из FileAPI.
		 */
		fileReader: null,

		/**
		 * Инициализирует объект файла.
		 * @param {File} file файл.
		 */
		constructor: function (file)
		{
			var me = this,
				fr;

			me.file = file;
			fr = new FileReader();
			fr.file = file;
			me.fileReader = fr;
		},

		/**
		 * Читает файл.
		 * @param {Object} opts Параметры.
		 * @param {String} opts.type Тип чтения файла.
		 * @param {Function} opts.load вызывается при успешном чтении файла.
		 * @return {Boolean} Успешно ли открыт файл.
		 */
		read: function (opts)
		{
			var me = this,
				result = true,
				fileReader = me.fileReader,
				file = me.file,
				type = opts.type ? opts.type : me.LOAD_TYPE_TEXT,
				encode;

			if (type === me.LOAD_TYPE_TEXT)
			{
				encode = me.getEncode();
				fileReader.readAsText(file, encode);
			}
			else if (type === me.LOAD_TYPE_ARRAYBUFFER)
			{
				fileReader.readAsArrayBuffer(file);
			}
			else
			{
				result = false;
			}
			fileReader.onload = opts.load ?
			                    function ()
			                    {
				                    opts.load(this.result);
			                    } :
			                    null;

			return result;
		},

		/**
		 * Возвращает кодировку файла.
		 * @return {String} Кодировка.
		 */
		getEncode: function ()
		{
			var encode;

			encode = 'windows-1251';

			return encode;
		}
	}
);