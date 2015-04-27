/**
 * Перемещает текстовый узел абзаца в начало следующего абзаца и удаляет пустой абзац.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.p.TextToNextNodeCommand',
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
				nodes.next = nodes.node.nextSibling;
				els.next = nodes.next.getElement();
				nodes.nextFirst = nodes.next.firstChild;
				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				console.log('text to next node', nodes, els);
				while (nodes.prevText = nodes.node.lastChild)
				{
					els.next.insertBefore(nodes.prevText.getElement(), nodes.next.firstChild.getElement());
					nodes.next.insertBefore(nodes.prevText, nodes.next.firstChild);
				}
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				FBEditor.editor.Manager.setFocusElement(els.next);
				sel.collapse(nodes.next);
				sel.extend(nodes.nextFirst.previousSibling, nodes.nextFirst.previousSibling.length);
				sel.collapseToEnd();

				me.data.node = nodes.next;
				me.data.text = nodes.nextFirst;

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
				nodes.text = data.text;
				els.text = nodes.text.getElement();
				viewportId = nodes.text.viewportId;
				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();
				els.newP = FBEditor.editor.Factory.createElement('p');
				nodes.newP = els.newP.getNode(viewportId);
				console.log('undo text to next node', nodes, els);
				els.parentP.insertBefore(els.newP, els.p);
				nodes.parentP.insertBefore(nodes.newP, nodes.p);
				while (nodes.text.previousSibling)
				{
					console.log('nodes.text.previousSibling', nodes.text.previousSibling);
					els.newP.add(nodes.p.firstChild.getElement());
					els.p.remove(nodes.p.firstChild.getElement());
					nodes.newP.appendChild(nodes.p.firstChild);
				}
				els.parentP.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(els.newP);
				sel.collapse(nodes.newP);
				sel.extend(nodes.newP.lastChild, nodes.newP.lastChild.length);
				sel.collapseToEnd();

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