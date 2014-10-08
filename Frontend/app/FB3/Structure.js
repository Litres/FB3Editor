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
		requires: [
			'FBEditor.FB3.rels.Rels',
			'FBEditor.FB3.rels.RelType',
			'FBEditor.util.xml.Json'
		],

		/**
		 * @property {Object} Корневой файл в структуре, определяющий типы.
		 * @property {String} contentTypes.file Имя файла.
		 * @property {Object} contentTypes.data Содержимое файла.
		 */
		contentTypes: {
			file: '[Content_Types].xml',
			rel: null
		},

		/**
		 * @property {Object} Корневой файл в структуре, определяющий связи.
		 * @property {String} rels.file Имя файла.
		 * @property {FBEditor.FB3.rels.Rels} rels.data Содержимое файла.
		 */
		rels: {
			file: '_rels/.rels',
			rel: null
		},

		/**
		 * @property {FBEditor.FB3.File} Файл FB3.
		 */
		fb3file: null,

		/**
		 * Создает структуру архива.
		 * @param {FBEditor.FB3.File} fb3file Файл FB3.
		 */
		constructor: function (fb3file)
		{
			var me = this;

			me.fb3file = fb3file;
			if (me.valid())
			{
				me.setRels();
			}
			else
			{
				throw Error('Ошибка структуры архива');
			}
		},

		/**
		 * Устанаваливает связи между частями архива.
		 */
		setRels: function ()
		{
			var me = this,
				rels = me.rels;

			rels.rel = Ext.create('FBEditor.FB3.rels.Rels', me);
		},

		/**
		 * Проверяет валидность структуры файлов.
		 * @return {Boolean} Валидна ли структура.
		 */
		valid: function ()
		{
			var me = this,
				files = me.fb3file.getFiles(),
				rootFiles = [me.contentTypes.file, me.rels.file],
				keysFiles = Ext.Object.getKeys(files),
				result = true;

			/*var x2js = new X2JS(
				{
					attributePrefix: ' '
				}
			);
			Ext.Msg.show(
				{
					title: 'Структура архива',
					message: keysFiles
				}
			);*/
			Ext.Object.each(
				rootFiles,
			    function (key, val)
			    {
				    if (!Ext.Array.contains(keysFiles, val))
				    {
					    result = false;

					    return false;
				    }
				    /*var text = files[val].asText();
				    var json = x2js.xml_str2json(text);
				    console.log(json);*/
			    }
			);

			return result;
		}
	}
);