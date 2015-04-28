/**
 * Создает заголовок.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.title.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				sel,
				range,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				els.title = data.title;
				sel = data.sel;
				range = sel.getRangeAt(0);
				nodes.node = range.endContainer.parentNode;
				nodes.parent = nodes.node.parentNode;
				nodes.node = nodes.parent.nodeName === 'HEADER' ? nodes.parent : nodes.node;
				nodes.parent = nodes.node.parentNode;
				nodes.next = nodes.node.nextSibling;
				els.parent = nodes.parent.getElement();
				viewportId = nodes.node.viewportId;
				console.log('create title', nodes, els);
				els.p = FBEditor.editor.Factory.createElement('p');
				els.t = FBEditor.editor.Factory.createElementText('Заголовок');
				els.p.add(els.t);
				els.title.add(els.p);
				nodes.title = els.title.getNode(viewportId);
				if (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.parent.insertBefore(els.title, els.next);
					nodes.parent.insertBefore(nodes.title, nodes.next);
				}
				else
				{
					els.parent.add(els.title);
					nodes.parent.appendChild(nodes.title);
				}
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(els.p);
				nodes.p = els.p.nodes[viewportId];
				sel.collapse(nodes.p);
				sel.extend(nodes.p.firstChild, nodes.p.firstChild.length);
				sel.collapseToEnd();

				data.title = nodes.title;

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
				res = false,
				els = {},
				nodes = {},
				sel,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				sel = data.sel;
				nodes.title = data.title;
				els.title = nodes.title.getElement();
				viewportId = nodes.title.viewportId;
				nodes.parent = nodes.title.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.cursor = nodes.title.previousSibling ? nodes.title.previousSibling.lastChild : null;
				nodes.cursor = !nodes.cursor && nodes.title.nextSibling ?
				               nodes.title.nextSibling.firstChild : nodes.cursor;
				nodes.cursor = !nodes.cursor && nodes.title.parentNode ? nodes.title.parentNode : nodes.cursor;
				console.log('undo create title', nodes, els, sel);
				els.parent.remove(els.title);
				nodes.parent.removeChild(nodes.title);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(nodes.cursor.getElement());
				sel.collapse(nodes.cursor);

				data.sel = sel;
				data.title = FBEditor.editor.Factory.createElement('title');

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