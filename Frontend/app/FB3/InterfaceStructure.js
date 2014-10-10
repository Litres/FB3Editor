/**
 * Интерфейс структуры архива FB3.
 * @interface
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.InterfaceStructure',
	{
		/**
		 * Возвращает мета-информацию.
		 * @return {FBEditor.FB3.rels.Meta}
		 */
		getMeta: function ()
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getMeta');
		},

		/**
		 * Возвращает список книг.
		 * @return {FBEditor.FB3.rels.Book[]}
		 */
		getBooks: function ()
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getBooks');
		},

		/**
		 * Возвращает описание книги.
		 * @param {FBEditor.FB3.rels.Book} Книга.
		 * @return {Object} Описание книги.
		 */
		getDesc: function (book)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getDesc');
		},

		/**
		 * Возвращает список тел книги.
		 * @param {FBEditor.FB3.rels.Book} Книга.
		 * @return {FBEditor.FB3.rels.Body[]} Список тел книги.
		 */
		getBodies: function (book)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getBodies');
		},

		/**
		 * Возвращает содержимое тела книги.
		 * @param {FBEditor.FB3.rels.Body} Тело книги.
		 * @return {String} Содержимое тела книги.
		 */
		getContent: function (body)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getContent');
		}
	}
);