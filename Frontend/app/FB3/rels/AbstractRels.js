/**
 * Абстрактный класс, определяющий связи между различными частями архива.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.AbstractRels',
	{
		/**
		 * @property {String} Префикс перед именем свойств в json, которые являлись аттрибутами в xml
		 * (берется из FBEditor.util.xml.Json#prefix).
		 */
		prefix: '',

		/**
		 * @private
		 * @property {Object} Ссылки на части архива.
		 */
		rels: null,

		/**
		 * @private
		 * @property {Object} Файл.
		 */
		file: null,

		/**
		 * @private
		 * @property {FBEditor.FB3.Structure} structure Структура архива FB3.
		 */
		structure: null,

		/**
		 * @private
		 * @property {String} Имя файла.
		 */
		fileName: null,

		/**
		 * @param {FBEditor.FB3.Structure} structure Структура архива FB3.
		 * @param {String} fileName Имя файла в архиве.
		 */
		constructor: function (structure, fileName)
		{
			var me = this;

			me.structure = structure;
			me.fileName = fileName;
			me.file = me.structure.getFb3file().getFiles(fileName);
			me.prefix = FBEditor.util.xml.Json.prefix;
			me.rels = me.getRels();
		},

		/**
		 * @abstract
		 * Возвращает связи для файла.
		 * @return {Object} Связи.
		 */
		getRels: function ()
		{
			throw Error('Не реализован метод FB3.rels.AbstractRels#getRels');
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
		 * Возвращает имя файла.
		 * @return {String} Имя файла.
		 */
		getFileName: function ()
		{
			var me = this;

			return me.fileName;
		},

		/**
		 * Возвращает содержмиое файла как JSON.
		 * @return {Object} Xml в виде JSON.
		 */
		getJson: function ()
		{
			var me = this,
				text = me.getText(),
				result;

			result = FBEditor.util.xml.Json.xmlToJson(text);

			return result;
		},

		/**
		 * Возвращает содержмиое файла как текст.
		 * @return {String} XML в виде текста.
		 */
		getText: function ()
		{
			var me = this,
				file = me.file;

			return file.asText();
		}
	}
);