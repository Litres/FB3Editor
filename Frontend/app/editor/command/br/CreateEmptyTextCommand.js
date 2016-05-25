/**
 * Заменяет элемент br на пустой текст.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.br.CreateEmptyTextCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				sel = window. getSelection(),
				manager,
				range;

			try
			{
				range = sel.getRangeAt(0);
				data.viewportId = range.startContainer.viewportId;

				console.log('replace br to empty text', range);

				nodes.node = range.startContainer;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				els.parent.removeAll();
				nodes.parent.removeChild(nodes.parent.firstChild);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				manager.setSuspendEvent(false);

				data.els = els;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
			}

			manager.setSuspendEvent(false);
			return res;
		},

		unExecute: function ()
		{
			// не требуется
			return false;
		}
	}
);