/**
 * Интерфейс элемента.
 *
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
		 * @param {FBEditor.editor.element.AbstractElement} nextEl Элемент. перед которым происходит вставка.
		 */
		insertBefore: function (el, nextEl)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#insertBefore()');
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
		 * Устанавливает события узла элемента.
		 * @param {HTMLElement} element Узел элемента.
		 * @return {HTMLElement} element Узел элемента.
		 */
		setEvents: function (element)
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#setEvents()');
		}
	}
);