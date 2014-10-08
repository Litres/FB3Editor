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
		 * @property {String} Префикс перед именем свойств в json (берется из FBEditor.util.xml.Json#prefix).
		 */
		prefix: '',

		constructor: function (structure)
		{
			var me = this,
				fileName;

			me.structure = structure;

			fileName = me.getFileName();
			me.file = me.structure.fb3file.getFiles(fileName);
			me.prefix = FBEditor.util.xml.Json.prefix;
			me.rels = me.getRels();
		},

		/**
		 * @abstract
		 * Возвращает имя файла в архиве.
		 * @return {String} Имя файла.
		 */
		getFileName: function ()
		{
			throw Error('Не реализован метод FB3.rels.AbstractRels#getFileName');
		},

		/**
		 * Возвращает ссылки на части архива.
		 * @return {Object} Ссылки.
		 */
		getRels: function ()
		{
			var me = this,
				rels = me.rels,
				json;

			if (!rels)
			{
				json = me.getJson();
				rels = json.Relationships.Relationship;
				rels = Ext.Array.toValueMap(rels, me.prefix + 'Type', 2);
			}

			return rels;
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