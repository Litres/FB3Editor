/**
 * Интерфейс структуры архива FB3.
 * @interface
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.InterfaceStructure',
	{
		/**
		 * Возвращает типы данных.
		 * @return {Object}
		 */
		getContentTypes: function ()
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getContentTypes');
		},

		/**
		 * Возвращает обложку.
		 * @return {Image}
		 */
		getThumb: function ()
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getThumb');
		},

		/**
		 * Возвращает мета-информацию.
		 * @return {Object}
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
		 * @param {FBEditor.FB3.rels.Book} book Книга.
		 * @return {Object} Описание книги.
		 */
		getDesc: function (book)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getDesc');
		},

		/**
		 * Возвращает список тел книги.
		 * @param {FBEditor.FB3.rels.Book} book Книга.
		 * @return {FBEditor.FB3.rels.Body[]} Список тел книги.
		 */
		getBodies: function (book)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getBodies');
		},

		/**
		 * Возвращает содержимое тела книги.
		 * @param {FBEditor.FB3.rels.Body} body Тело книги.
		 * @return {String} Содержимое тела книги.
		 */
		getContent: function (body)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getContent');
		},

		/**
		 * Возвращает список изображений для тела книги.
		 * @param {FBEditor.FB3.rels.Body} body Тело книги.
		 * @return {FBEditor.FB3.rels.Image[]} Список изображений.
		 */
		getImages: function (body)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#getImages');
		},

		/**
		 * Устанавливает обложку.
		 * @param {Object} data Данные обложки.
		 */
		setThumb: function (data)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#setThumb');
		},

		/**
		 * Устанавливает мета-информацию.
		 * @param {String} data
		 */
		setMeta: function ()
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#setMeta');
		},

		/**
		 * Устанавливает описание книги.
		 * @param {FBEditor.FB3.rels.Book} book Книга.
		 * @param {String} data
		 */
		setDesc: function (book, data)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#setDesc');
		},

		/**
		 * Устанавливает содержимое тела книги.
		 * @param {FBEditor.FB3.rels.Body} body Тело книги.
		 * @param {String} Содержимое тела книги.
		 */
		setContent: function (body, data)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#setContent');
		},

		/**
		 * Устанавливает список изображений для тела книги.
		 * @param {FBEditor.FB3.rels.Body} body Тело книги.
		 * @param {Object[]} Данные изображений.
		 */
		setImages: function (body, data)
		{
			throw Error('Не реализован метод FB3.InterfaceStructure#setImages');
		}
	}
);