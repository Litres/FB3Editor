/**
 * Абстрактный класс для обработки выделения элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractSelection',
	{
		/**
		 * @property {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		el: null,

		/**
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 */
		constructor: function (el)
		{
			var me = this;

			me.el = el;
		},

		/**
		 * @abstract
		 * Выполняет обработку выделения элемента.
		 */
		execute: function ()
		{
			// необходима реализация в конкретном классе
		}
	}
);