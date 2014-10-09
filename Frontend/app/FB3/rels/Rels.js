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
			'FBEditor.FB3.rels.Book',
			'FBEditor.FB3.rels.BookRels',
			'FBEditor.FB3.rels.Body'
		],

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
					    selfBooks[i] = Ext.create('FBEditor.FB3.rels.Book', me.getStructure(),
					                                  item[me.prefix + 'Target']);
				    }
				);
			}
			books = Ext.isNumeric(index) ? books[index] : books;

			return books;
		}
	}
);