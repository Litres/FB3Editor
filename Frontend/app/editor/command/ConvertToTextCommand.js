/**
 * Преобразует элемент в текст, оставляя только стилевые элементы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.ConvertToTextCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				range,
				manager = FBEditor.editor.Manager;

			try
			{
				manager.suspendEvent = true;

				range = data.range || manager.getRange();
				data.viewportId = range.start.viewportId;

				console.log('convert to text ' + data.el.xmlTag, data, range);

				els.node = data.el;
				nodes.node = els.node.nodes[data.viewportId];
				els.parent = els.node.parent;
				nodes.parent = els.parent.nodes[data.viewportId];
				nodes.next = nodes.node.nextSibling;
				els.next = nodes.next ? nodes.next.getElement() : null;
				nodes.prev = nodes.node.previousSibling;
				els.prev = nodes.prev ? nodes.prev.getElement() : null;

				// преобразуем

				return false;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.removeNext();
			}

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				nodes = {},
				els = {},
				res = false,
				range;



			return res;
		}
	}
);