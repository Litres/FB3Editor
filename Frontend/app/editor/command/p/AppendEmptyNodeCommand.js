/**
 * Добавляет пустой абзац.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.p.AppendEmptyNodeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				sel = window.getSelection(),
				node,
				newNode,
				next,
				parent,
				parentEl,
				viewportId;

			try
			{
				// Узел p, после которого добавится пустой абзац
				node = data.node;

				viewportId = node.viewportId;
				parent = node.parentNode;
				next = node.nextSibling;
				parentEl = parent.getElement();
				els.p = FBEditor.editor.Factory.createElement('p');
				els.br = FBEditor.editor.Factory.createElement('br');
				els.p.add(els.br);
				FBEditor.editor.Manager.suspendEvent = true;
				newNode = els.p.getNode(viewportId);
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
				FBEditor.editor.HistoryManager.removeNext();
			}

			return res;
		},

		unExecute: function ()
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
				if (!data.node)
				{
					throw new Error('Невозможно отменить команду вставки пустого абзаца. Потеряна ссылка на узел.');
				}
				FBEditor.editor.Manager.suspendEvent = true;
				nodes.p = data.node;
				viewportId = nodes.p.viewportId;
				els.p = nodes.p.getElement();
				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();
				nodes.prevP = nodes.p.previousSibling;
				els.prevP = nodes.prevP.getElement();

				console.log('undo append', nodes, els);

				els.parentP.remove(els.p);
				nodes.parentP.removeChild(nodes.p);
				els.parentP.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(els.prevP);
				sel.collapse(nodes.prevP.lastChild);
				sel.extend(nodes.prevP.lastChild, nodes.prevP.lastChild.length);
				sel.collapseToEnd();

				me.data.node = nodes.prevP;

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