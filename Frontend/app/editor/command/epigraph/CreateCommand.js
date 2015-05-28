/**
 * Создает эпиграф.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.epigraph.CreateCommand',
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
				els.epigraph = FBEditor.editor.Factory.createElement('epigraph');
				nodes.node = data.node || data.prevNode;
				nodes.parent = nodes.node.parentNode;
				nodes.node = nodes.parent.getElement().xmlTag === els.epigraph.xmlTag ? nodes.parent : nodes.node;
				nodes.parent = nodes.node.parentNode;
				nodes.first = data.prevNode && data.prevNode.nextSibling ? data.prevNode : nodes.parent.firstChild;
				els.parent = nodes.parent.getElement();
				viewportId = nodes.node.viewportId;
				els.p = FBEditor.editor.Factory.createElement('p');
				els.t = FBEditor.editor.Factory.createElementText('Эпиграф');
				els.p.add(els.t);
				els.epigraph.add(els.p);
				nodes.epigraph = els.epigraph.getNode(viewportId);
				if (nodes.first)
				{
					if (data.prevNode && data.prevNode.getElement().xmlTag === els.epigraph.xmlTag)
					{
						// вставка после конкретного эпиграфа
						nodes.first = nodes.first.nextSibling;
					}
					else
					{
						// вставка после всех эпиграфов или заголовка
						nodes.next = nodes.first.nextSibling;
						while (nodes.next &&
						       (nodes.first.getElement().xmlTag === els.epigraph.xmlTag ||
						        nodes.first.getElement().xmlTag === 'title'))
						{
							nodes.first = nodes.next;
							nodes.next = nodes.next.nextSibling;
						}
					}
					els.first = nodes.first.getElement();
					els.parent.insertBefore(els.epigraph, els.first);
					nodes.parent.insertBefore(nodes.epigraph, nodes.first);
				}
				else
				{
					els.parent.add(els.epigraph);
					nodes.parent.appendChild(nodes.epigraph);
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

				data.epigraph = nodes.epigraph;

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
				nodes.epigraph = data.epigraph;
				els.epigraph = nodes.epigraph.getElement();
				viewportId = nodes.epigraph.viewportId;
				nodes.parent = nodes.epigraph.parentNode;
				els.parent = nodes.parent.getElement();
				els.parent.remove(els.epigraph);
				nodes.parent.removeChild(nodes.epigraph);
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