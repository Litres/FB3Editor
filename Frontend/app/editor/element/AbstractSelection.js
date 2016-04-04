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
			throw Error('Не реализован метод FBEditor.editor.element.AbstractSelection#execute');
		},

		/**
		 * @abstract
		 * Активно ли выделение на данный момент.
		 * @return {Boolean}
		 */
		isActive: function ()
		{
			// необходима реализация в конкретном классе
			throw Error('Не реализован метод FBEditor.editor.element.AbstractSelection#isActive');
		}
	}
);