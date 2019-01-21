/**
 * Создает poem из выделения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.poem.CreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateRangeCommand',

		elementName: 'poem',

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager,
				range,
				viewportId;

			try
			{
				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;

				console.log('undo create range ' + me.elementName, range, nodes);

				els.node = nodes.node.getElement();
				manager = els.node.getManager();
				manager.removeAllOverlays();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				manager.setSuspendEvent(true);

				// переносим все элементы обратно в исходный контейнер
				nodes.first = nodes.stanza.firstChild;
				els.first = nodes.first.getElement();
				while (els.first)
				{
					els.parent.insertBefore(els.first, els.node);
					nodes.parent.insertBefore(nodes.first, nodes.node);
					nodes.first = nodes.stanza.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
				}

				// удаляем новый элемент
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				// объединяем элементы в точках разделения
				if (range.joinStartContainer)
				{
					manager.joinNode(nodes.startContainer);
				}
				if (range.joinEndContainer)
				{
					manager.joinNode(nodes.endContainer);
				}

				// синхронизируем
				els.parent.sync(viewportId);

				// устанавливаем выделение
				if (!range.joinStartContainer)
				{
					range.start = nodes.startContainer;
					range.common = range.start.getElement().isText ? range.start.parentNode : range.start;
				}
				else
				{
					range.common = range.common.getElement().isText ? range.common.parentNode : range.common;
				}

				range.common = range.common ? range.common : range.prevParentStart.parentNode;
				range.start = range.start.parentNode ? range.start : range.prevParentStart.nextSibling;
				range.end = range.collapsed || !range.end.parentNode ? range.start : range.end;
				range.end = !range.collapsed && range.end.firstChild ? range.end.firstChild : range.end;

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end
				};
				manager.setCursor(data.saveRange);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			manager.updateTree();
			
			return res;
		},

		createNewElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory;

			// поэма
			els.node = factory.createElement(me.elementName);
			nodes.node = els.node.getNode(data.viewportId);

			// стих
			els.stanza = factory.createElement('stanza');
			nodes.stanza = els.stanza.getNode(data.viewportId);

			els.node.add(els.stanza);
			nodes.node.appendChild(nodes.stanza);

			//console.log('nodes', nodes, range);
			//return;

			// вставляем новый элемент
			els.common.insertBefore(els.node, els.startContainer);
			nodes.common.insertBefore(nodes.node, nodes.startContainer);

			// переносим элементы, которые находятся в текущем выделении в новый элемент
			nodes.next = nodes.startContainer;
			els.next = nodes.next.getElement();
			while (els.next && els.next.elementId !== els.endContainer.elementId)
			{
				nodes.buf = nodes.next.nextSibling;

				els.stanza.add(els.next);
				nodes.stanza.appendChild(nodes.next);

				nodes.next = nodes.buf;
				els.next = nodes.next ? nodes.next.getElement() : null;
			}
			if (els.next && els.next.elementId === els.endContainer.elementId && !data.range.joinEndContainer)
			{
				els.stanza.add(els.next);
				nodes.stanza.appendChild(nodes.next);
			}
		}
	}
);