/**
 * Интерфейс элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.InterfaceElement',
	{
		/**
		 * Возвращает элемент в виде строки html для отображения.
		 * return {HTMLElement} Строка html.
		 */
		getHtml: function ()
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#getHtml()');
		},

		/**
		 * Возвращает элемент в виде строки xml для сохранения.
		 * return {String} Строка xml.
		 */
		getXml: function ()
		{
			throw Error('Не реализован метод FBEditor.editor.element.InterfaceElement#getXml()');
		}
	}
);