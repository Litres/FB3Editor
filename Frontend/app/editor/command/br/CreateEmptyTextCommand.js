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
				manager = FBEditor.editor.Manager,
				range;

			try
			{
				manager.suspendEvent = true;

				range = sel.getRangeAt(0);
				data.viewportId = range.startContainer.viewportId;

				console.log('replace br to empty text', range);

				nodes.node = range.startContainer;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				els.parent.removeAll();
				nodes.parent.removeChild(nodes.parent.firstChild);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				//console.log('nodes', nodes, els);

				data.els = els;

				res = true;
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
				manager = FBEditor.editor.Manager,
				range;

			// не требуется
			return false;

			try
			{
				manager.suspendEvent = true;

				els = data.els;

				console.log('undo replace br to empty text', els, data);

				nodes.node = els.node.nodes[data.viewportId];
				nodes.parent = els.parent.nodes[data.viewportId];

				console.log('nodes', nodes);

				return false;

				els.parent.add(els.node);
				nodes.parent.appendChild(nodes.node);

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.node
				};
				FBEditor.editor.Manager.setCursor(data.saveRange);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
		}
	}
);