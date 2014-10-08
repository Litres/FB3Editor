/**
 * Корневой файл в структуре FB3, определяющий связи между различными частями архива.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Rels',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		/**
		 * @property {Object} Обложка.
		 */
		thumb: null,

		/**
		 * @property {Object} Мета-информация.
		 */
		meta: null,

		/**
		 * @property {Object[]} Описание и содержимое книг (может быть подшивкой из нескольких книг).
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

		/**
		 * Возвращает имя файла в архиве.
		 * @return {String} Имя файла.
		 */
		getFileName: function ()
		{
			var me = this;

			return me.getStructure().rels.file;
		},

		/**
		 * Возвращает книгу или все книги, если не передан параметр index.
		 * @param {Number} [index] Индекс книги в массиве.
		 * @return {Object|Array} Книга или массив книг.
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
			}
			books = index ? books[index] : books;

			return books;
		}
	}
);