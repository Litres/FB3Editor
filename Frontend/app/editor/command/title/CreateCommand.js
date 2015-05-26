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
				sel = window.getSelection(),
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				els.title = FBEditor.editor.Factory.createElement('title');
				nodes.node = data.node;
				nodes.parent = nodes.node.parentNode;
				nodes.node = nodes.parent.nodeName === 'HEADER' ? nodes.parent : nodes.node;
				nodes.parent = nodes.node.parentNode;
				nodes.first = nodes.parent.firstChild;
				els.parent = nodes.parent.getElement();
				viewportId = nodes.node.viewportId;
				els.p = FBEditor.editor.Factory.createElement('p');
				els.t = FBEditor.editor.Factory.createElementText('Заголовок');
				els.p.add(els.t);
				els.title.add(els.p);
				nodes.title = els.title.getNode(viewportId);
				if (nodes.first)
				{
					els.first = nodes.first.getElement();
					els.parent.insertBefore(els.title, els.first);
					nodes.parent.insertBefore(nodes.title, nodes.first);
				}
				else
				{
					els.parent.add(els.title);
					nodes.parent.appendChild(nodes.title);
				}
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				data.oldRange = sel.getRangeAt(0);
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
				sel = window.getSelection(),
				range,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				nodes.title = data.title;
				els.title = nodes.title.getElement();
				viewportId = nodes.title.viewportId;
				nodes.parent = nodes.title.parentNode;
				els.parent = nodes.parent.getElement();
				els.parent.remove(els.title);
				nodes.parent.removeChild(nodes.title);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				range = data.oldRange;
				nodes.cursor = range.endContainer;
				els.cursor = nodes.cursor.getElement();
				FBEditor.editor.Manager.setFocusElement(els.cursor);
				sel.collapse(nodes.cursor, range.endOffset);

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