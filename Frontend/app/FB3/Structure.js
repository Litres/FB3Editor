/**
 * Структура архива FB3.
 * Файл fb3 представляет собой пакет
 * {@link http://www.ecma-international.org/publications/standards/Ecma-376.htm OPC (ECMA-376 Part 2)}
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.Structure',
	{
		extend: 'FBEditor.FB3.InterfaceStructure',
		requires: [
			'FBEditor.FB3.rels.Rels',
			'FBEditor.FB3.rels.RelType',
			'FBEditor.util.xml.Json'
		],

		/**
		 * @private
		 * @property {Object} Корневой файл в структуре, определяющий типы.
		 * @property {String} contentTypes.file Имя файла.
		 * @property {Object} contentTypes.rel Содержимое файла.
		 */
		contentTypes: {
			file: '[Content_Types].xml',
			rel: null
		},

		/**
		 * @private
		 * @property {Object} Корневой файл в структуре, определяющий связи.
		 * @property {String} rels.file Имя файла.
		 * @property {FBEditor.FB3.rels.Rels} rels.rel Содержимое файла.
		 */
		rels: {
			file: '_rels/.rels',
			rel: null
		},

		/**
		 * @private
		 * @property {FBEditor.FB3.File} Файл FB3.
		 */
		fb3file: null,

		/**
		 * Создает структуру архива.
		 * @param {FBEditor.FB3.File} fb3file Файл FB3.
		 */
		constructor: function (fb3file)
		{
			var me = this,
				rels = me.rels;

			me.fb3file = fb3file;
			if (me.valid())
			{
				rels.rel = Ext.create('FBEditor.FB3.rels.Rels', me, rels.file);
			}
			else
			{
				throw Error('Ошибка структуры архива');
			}
		},

		getMeta: function ()
		{
			var me = this;

			return me.getRels().getMeta().getContent();
		},

		getBooks: function ()
		{
			var me = this;

			return me.getRels().getBooks();
		},

		getDesc: function (book)
		{
			return book.getDesc();
		},

		getBodies: function (book)
		{
			return book.getRels().getBodies();
		},

		getContent: function (body)
		{
			return body.getContent();
		},

		/**
		 * Возвращает файл FB3.
		 * @return {FBEditor.FB3.File} Файл FB3.
		 */
		getFb3file: function ()
		{
			var me = this;

			return me.fb3file;
		},

		/**
		 * @private
		 * Возвращает связи между частями архива.
		 * @return {FBEditor.FB3.rels.Rels} Корневой файл в структуре FB3, определяющий связи
		 * между различными частями архива.
		 */
		getRels: function ()
		{
			var me = this;

			return me.rels.rel;
		},

		/**
		 * @private
		 * Проверяет валидность структуры файлов.
		 * @return {Boolean} Валидна ли структура.
		 */
		valid: function ()
		{
			var me = this,
				files = me.getFb3file().getFiles(),
				rootFiles = [me.contentTypes.file, me.rels.file],
				keysFiles = Ext.Object.getKeys(files),
				result = true;

			Ext.Object.each(
				rootFiles,
			    function (key, val)
			    {
				    if (!Ext.Array.contains(keysFiles, val))
				    {
					    result = false;

					    return false;
				    }
			    }
			);

			return result;
		}
	}
);