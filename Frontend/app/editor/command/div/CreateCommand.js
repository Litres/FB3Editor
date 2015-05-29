/**
 * Создает блок.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.div.CreateCommand',
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
				els.div = FBEditor.editor.Factory.createElement('div');
				nodes.node = data.node || data.prevNode;
				nodes.parent = nodes.node.parentNode;
				nodes.node = nodes.parent.getElement().xmlTag === els.div.xmlTag ? nodes.parent : nodes.node;
				nodes.parent = nodes.node.parentNode;
				nodes.next = nodes.node.nextSibling;
				els.parent = nodes.parent.getElement();
				viewportId = nodes.node.viewportId;
				els.p = FBEditor.editor.Factory.createElement('p');
				els.t = FBEditor.editor.Factory.createElementText('Блок');
				els.p.add(els.t);
				els.div.add(els.p);
				nodes.div = els.div.getNode(viewportId);
				if (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.parent.insertBefore(els.div, els.next);
					nodes.parent.insertBefore(nodes.div, nodes.next);
				}
				else
				{
					els.parent.add(els.div);
					nodes.parent.appendChild(nodes.div);
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

				data.div = nodes.div;

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
				nodes.div = data.div;
				els.div = nodes.div.getElement();
				viewportId = nodes.div.viewportId;
				nodes.parent = nodes.div.parentNode;
				els.parent = nodes.parent.getElement();
				els.parent.remove(els.div);
				nodes.parent.removeChild(nodes.div);
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