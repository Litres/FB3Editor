/**
 * Удаляет пустой абзац.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.p.RemoveEmptyNodeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				sel = window.getSelection(),
				el,
				node,
				sibling,
				prev,
				next,
				parent,
				parentEl,
				viewportId;

			try
			{
				node = data.node;
				prev = node.previousSibling;
				next = node.nextSibling;
				sibling = data.sibling;
				viewportId = node.viewportId;
				el = node.getElement();
				parent = node.parentNode;
				parentEl = parent.getElement();
				console.log('remove empty node', node, sibling);
				FBEditor.editor.Manager.suspendEvent = true;
				parentEl.remove(el);
				parent.removeChild(node);
				parentEl.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				if (sibling === 'prev')
				{
					FBEditor.editor.Manager.setFocusElement(prev.getElement());
					sel.collapse(prev);
					sel.extend(prev.lastChild, prev.lastChild.length);
					sel.collapseToEnd();
					me.data.node = prev;
				}
				else
				{
					FBEditor.editor.Manager.setFocusElement(next.getElement());
					sel.collapse(next);
					me.data.node = next;
				}

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
				sel = window.getSelection(),
				node,
				prev,
				next,
				newNode,
				sibling,
				parent,
				parentEl,
				viewportId;

			try
			{
				sibling = data.sibling;
				node = data.node;
				prev = node.previousSibling;
				next = node.nextSibling;
				viewportId = node.viewportId;
				parent = node.parentNode;
				parentEl = parent.getElement();

				FBEditor.editor.Manager.suspendEvent = true;
				console.log('undo remove empty node', node, sibling);
				els.p = FBEditor.editor.Factory.createElement('p');
				els.br = FBEditor.editor.Factory.createElement('br');
				els.p.add(els.br);
				newNode = els.p.getNode(viewportId);
				if (sibling === 'prev')
				{
					if (next)
					{
						parentEl.insertBefore(els.p, next.getElement());
						parent.insertBefore(newNode, next);
					}
					else
					{
						parentEl.add(els.p);
						parent.appendChild(newNode);
					}
				}
				else
				{
					parentEl.insertBefore(els.p, node.getElement());
					parent.insertBefore(newNode, node);
				}
				parentEl.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(els.p);
				sel.collapse(newNode);

				// сохраняем ссылку на новый узел
				me.data.node = newNode;

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