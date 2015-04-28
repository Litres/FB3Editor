/**
 * Перемещает текстовый узел абзаца в конец предыдущего абзаца и удаляет пустой абзац.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.p.TextToPrevNodeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				sel = window.getSelection(),
				els = {},
				nodes = {},
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				nodes.node = data.node;
				els.node = nodes.node.getElement();
				nodes.prev = nodes.node.previousSibling;
				els.prev = nodes.prev.getElement();
				nodes.prevLast = nodes.prev.lastChild;
				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				console.log('nodes to prev', nodes, els);
				while (nodes.node.firstChild)
				{
					console.log('nodes.node.firstChild', nodes.node.firstChild, nodes.node.firstChild.getElement());
					els.prev.add(nodes.node.firstChild.getElement());
					nodes.prev.appendChild(nodes.node.firstChild);
				}
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				FBEditor.editor.Manager.setFocusElement(els.prev);
				sel.collapse(nodes.prevLast.nextSibling);

				me.data.node = nodes.prev;
				me.data.prevLast = nodes.prevLast;

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
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				nodes.p = data.node;
				els.p = nodes.p.getElement();
				nodes.prevLast = data.prevLast;
				els.prevLast = nodes.prevLast.getElement();
				viewportId = nodes.prevLast.viewportId;
				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();
				nodes.next = nodes.p.nextSibling;
				els.newP = FBEditor.editor.Factory.createElement('p');
				nodes.newP = els.newP.getNode(viewportId);
				console.log('undo nodes to prev', nodes, els);
				if (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.parentP.insertBefore(els.newP, els.next);
					nodes.parentP.insertBefore(nodes.newP, nodes.next);
				}
				else
				{
					els.parentP.add(els.newP);
					nodes.parentP.appendChild(nodes.newP);
				}
				while (nodes.prevLast.nextSibling)
				{
					nodes.last = nodes.p.lastChild;
					els.last = nodes.last.getElement();
					console.log('nodes.p.lastChild', nodes.last.nodeType, nodes.last, els.last);
					if (nodes.newP.firstChild)
					{
						els.newP.insertBefore(els.last, nodes.newP.firstChild.getElement());
						nodes.newP.insertBefore(nodes.last, nodes.newP.firstChild);
					}
					else
					{
						els.newP.add(els.last);
						nodes.newP.appendChild(nodes.last);
					}
					els.p.remove(els.last);
				}
				els.parentP.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(els.newP);
				sel.collapse(nodes.newP);
				//sel.extend(nodes.newP.lastChild, nodes.newP.lastChild.length);
				//sel.collapseToEnd();

				// сохраняем ссылки
				me.data.node = nodes.newP;

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