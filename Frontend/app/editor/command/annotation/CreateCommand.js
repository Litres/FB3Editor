/**
 * Создает аннотацию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.annotation.CreateCommand',
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
				els.annotation = FBEditor.editor.Factory.createElement('annotation');
				nodes.node = data.node || data.prevNode;
				nodes.parent = nodes.node.parentNode;
				nodes.first = nodes.parent.firstChild;
				els.parent = nodes.parent.getElement();
				viewportId = nodes.node.viewportId;
				els.p = FBEditor.editor.Factory.createElement('p');
				els.t = FBEditor.editor.Factory.createElementText('Аннотация');
				els.p.add(els.t);
				els.annotation.add(els.p);
				nodes.annotation = els.annotation.getNode(viewportId);
				if (nodes.first)
				{
					// вставка после всех эпиграфов или заголовка
					nodes.next = nodes.first.nextSibling;
					while (nodes.next &&
					       (nodes.first.getElement().xmlTag === 'epigraph' ||
					        nodes.first.getElement().xmlTag === 'title'))
					{
						nodes.first = nodes.next;
						nodes.next = nodes.next.nextSibling;
					}
					els.first = nodes.first.getElement();
					els.parent.insertBefore(els.annotation, els.first);
					nodes.parent.insertBefore(nodes.annotation, nodes.first);
				}
				else
				{
					els.parent.add(els.annotation);
					nodes.parent.appendChild(nodes.annotation);
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

				data.annotation = nodes.annotation;

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
				nodes.annotation = data.annotation;
				els.annotation = nodes.annotation.getElement();
				viewportId = nodes.annotation.viewportId;
				nodes.parent = nodes.annotation.parentNode;
				els.parent = nodes.parent.getElement();
				els.parent.remove(els.annotation);
				nodes.parent.removeChild(nodes.annotation);
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