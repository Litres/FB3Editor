/**
 * Интерфейс элемента.
 *
 * @interface
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.InterfaceElement',
	{
		/**
		 * Добавляет новый дочерний элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 */
		add: function (el)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#add()');
		},

		/**
		 * Вставляет новый дочерний элемент перед другим дочерним элементом.
		 * @param {FBEditor.editor.element.AbstractElement} el Вставляемый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} nextEl Элемент, перед которым происходит вставка.
		 */
		insertBefore: function (el, nextEl)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#insertBefore()');
		},

		/**
		 * Заменяет дочерний элемент на новый.
		 * @param {FBEditor.editor.element.AbstractElement} el Новый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} replacementEl Заменяемый элемент.
		 */
		replace: function (el, replacementEl)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#replaceChild()');
		},

		/**
		 * Удаляет дочерний элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 */
		remove: function (el)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#remove()');
		},

		/**
		 * Удаляет все дочерние элементы.
		 */
		removeAll: function ()
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#removeAll()');
		},

		/**
		 * Удаляет все связи элемента на используемые объекты.
		 */
		clear: function ()
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#clear()');
		},

		/**
		 * Клонирует элемент.
		 * @param {Object} opts Опции клонирования..
		 * @return {FBEditor.editor.element.AbstractElement} Клонированный элемент.
		 */
		clone: function (opts)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#clone()');
		},

		/**
		 * Устанавливает html-узел для элемента.
		 * @param {HTMLElement} node Узел html.
		 */
		setNode: function (node)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#setNode()');
		},

		/**
		 * Возвращает узел html для отображения.
		 * @param {String} viewportId Id окна.
		 * @return {HTMLElement} Узел html.
		 */
		getNode: function (viewportId)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#getNode()');
		},

		/**
		 * Удаляет все ссылки на узлы окна.
		 * @param {String} viewportId Id окна.
		 */
		removeNodes: function (viewportId)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#removeNodes()');
		},

		/**
		 * Возвращает элемент в виде строки xml для сохранения.
		 * @return {String} Строка xml.
		 */
		getXml: function ()
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#getXml()');
		},

		/**
		 * Возвращает данные об элементе.
		 * @return {Object} Данные элемента.
		 */
		getData: function ()
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#getData()');
		},

		/**
		 * Синхронизирует узлы элемента в окнах.
		 * @param {String} viewportId Id окна источника.
		 */
		sync: function (viewportId)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#sync()');
		},

		/**
		 * Обновляет данные элемента и его отображение.
		 * @param {Object} data Новые данные для элемента.
		 * @param opts Опции.
		 * @param {Boolean} opts.withoutView true - обновить только данные, без обновления отображения.
		 */
		update: function (data, opts)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#update()');
		}
	}
);