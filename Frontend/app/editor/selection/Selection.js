/**
 * Переписывает нативное выделение.
 *
 * Конкретная реализация данного класса используется в элементах.
 * Смотрите свойство selectionClass в элементе, который реализует собственное выделение.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.selection.Selection',
	{
		/**
		 * @property {Node} Узел элемента, к которому привязано выделение.
		 */
		node: null,

		constructor: function (node)
		{
			var me = this;

			me.node = node;
		}
	}
);