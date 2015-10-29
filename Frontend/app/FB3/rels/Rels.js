/**
 * Корневой файл в структуре FB3, определяющий связи между различными частями архива.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Rels',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',
		requires: [
			'FBEditor.FB3.rels.Thumb',
			'FBEditor.FB3.rels.Meta',
			'FBEditor.FB3.rels.Book',
			'FBEditor.FB3.rels.BookRels',
			'FBEditor.FB3.rels.Body',
		    'FBEditor.FB3.rels.BodyRels'
		],

		defaultContent: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
            '<Relationship Id="rId0" ' +
	                'Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail" ' +
	                'Target="cover.jpg"/>' +
            '<Relationship Id="rId1" ' +
	                'Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" ' +
	                'Target="meta/core.xml"/>' +
            '<Relationship Id="rId2" ' +
	                'Type="http://www.fictionbook.org/FictionBook3/relationships/Book" ' +
	                'Target="fb3/description.xml"/>' +
		    '</Relationships>',

		/**
		 * @private
		 * @property {Object} Обложка.
		 */
		thumb: null,

		/**
		 * @private
		 * @property {Object} Мета-информация.
		 */
		meta: null,

		/**
		 * @private
		 * @property {FBEditor.FB3.rels.Book[]} Описание и содержимое книг (может быть подшивкой из нескольких книг).
		 */
		books: null,

		/**
		 * Инициализирует связи.
		 */
		constructor: function ()
		{
			var me = this;

			me.callParent(arguments);
			me.books = me.getBooks();
		},

		create: function (structure, fileName)
		{
			var me = this,
				fb3file = structure.getFb3file(),
				zip;

			// создаем необходимые пустые файлы для структуры
			zip = fb3file.zip;
			zip.file('meta/core.xml');
			zip.file('fb3/body.xml');
			//zip.file('cover.jpg');
			me.callParent(arguments);
		},

		getRels: function ()
		{
			var me = this,
				rels = me.rels,
				json;

			if (!rels)
			{
				json = me.getJson();
				rels = json.Relationships.Relationship;
				rels = Ext.isArray(rels) ? rels : [rels];
				rels = Ext.Array.toValueMap(rels, me.prefix + 'Type', 2);
			}

			return rels;
		},

		/**
		 * Возвращает книгу или все книги, если не передан параметр index.
		 * @param {Number} [index] Индекс книги в массиве.
		 * @return {FBEditor.FB3.rels.Book|FBEditor.FB3.rels.Book[]} Книга или массив книг.
		 */
		getBooks: function (index)
		{
			var me = this,
				books = me.books,
				rels;

			if (!books)
			{
				rels = me.getRels();
				books = rels[FBEditor.FB3.rels.RelType.book];
				books = Ext.isArray(books) ? books : [books];
				Ext.each(
					books,
				    function (item, i, selfBooks)
				    {
					    var targetName = item[me.prefix + 'Target'];

					    // путь может быть абсолютным или относительным
					    targetName = targetName.replace(/^[/]/, '');

					    selfBooks[i] = Ext.create('FBEditor.FB3.rels.Book', me.getStructure(), targetName);
				    }
				);
			}
			books = Ext.isNumeric(index) ? books[index] : books;

			return books;
		},

		/**
		 * Возвращает обложку.
		 * @return {FBEditor.FB3.rels.Thumb}
		 */
		getThumb: function ()
		{
			var me = this,
				thumb = me.thumb,
				rels;

			if (!thumb)
			{
				rels = me.getRels();
				thumb = rels[FBEditor.FB3.rels.RelType.thumbnail];
				thumb = Ext.create('FBEditor.FB3.rels.Thumb', me.getStructure(), thumb[me.prefix + 'Target']);
			}

			return thumb;
		},

		/**
		 * Возвращает мета-информацию.
		 * @return {FBEditor.FB3.rels.Meta}
		 */
		getMeta: function ()
		{
			var me = this,
				meta = me.meta,
				rels;

			if (!meta)
			{
				rels = me.getRels();
				meta = rels[FBEditor.FB3.rels.RelType.coreProperties];
				meta = Ext.create('FBEditor.FB3.rels.Meta', me.getStructure(), meta[me.prefix + 'Target']);
			}

			return meta;
		},

		/**
		 * Устанавливает обложку.
		 * @param {FBEditor.resource.Resource} Данные обложки.
		 */
		setThumb: function (data)
		{
			var me = this,
				content = me.getText(),
				target;

			target = data.rootName;
			content = content.replace(/thumbnail" Target="(.*?)"/, 'thumbnail" Target="' + target + '"');
			me.setFileContent(content);
			console.log('save thumb', data, content);
		}
	}
);