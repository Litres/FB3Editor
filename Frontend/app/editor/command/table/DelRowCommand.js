/**
 * Команда удаления строки.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.DelRowCommand',
	{
		extend: 'FBEditor.editor.command.DeleteCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				nodes = {},
				els = {},
				manager = FBEditor.editor.Manager,
				range,
				res;

			nodes.node = data.node;
			els.node = nodes.node.getElement();

			range = data.range || manager.getRange();
			data.range = range;

			// ищем tr
			while (!els.node.isTr)
			{
				nodes.node = nodes.node.parentNode;
				els.node = nodes.node.getElement();

				if (!nodes.node.parentNode.parentNode)
				{
					// если ссылка на элемент была потеряна в результате многократного использования ctrl+z,
					// то пытаемся восстановить ссылку из текущего выделения
					range = manager.getRange();
					data.range = range;
					nodes.node = data.range.start;
					els.node = nodes.node.getElement();
					data.node = nodes.node;
				}
			}

			nodes.table = nodes.node.parentNode;
			els.table = nodes.table.getElement();

			// если в таблице осталась одна строка, то удаляем всю таблицу
			data.el = els.table.children.length === 1 ? els.table : els.node;

			res = me.callParent(arguments);

			return res;
		}
	}
);