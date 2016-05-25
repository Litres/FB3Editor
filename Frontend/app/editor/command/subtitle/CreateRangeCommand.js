/**
 * Создает subtitle из выделения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.subtitle.CreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateRangeCommand',

		elementName: 'subtitle',

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
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				// переносим все элементы обратно в исходный контейнер
				Ext.Array.each(
					nodes.links,
					function (item)
					{
						var p = item.el,
							elP = p.getElement();

						// переносим параграф
						els.parent.insertBefore(elP, els.node);
						nodes.parent.insertBefore(p, nodes.node);

						// переносим дочерние элементы параграфа
						Ext.Array.each(
							item.children,
						    function (child)
						    {
							    var elChild = child.getElement();

							    elP.add(elChild);
							    p.appendChild(child);
						    }
						);
					}
				);

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
			return res;
		},

		createNewElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory,
				saveP;

			els.node = factory.createElement(me.elementName);
			nodes.node = els.node.getNode(data.viewportId);

			//console.log('nodes', nodes);
			//return;

			// ссылки на параграфы
			nodes.links = [];

			// вставляем новый элемент
			els.common.insertBefore(els.node, els.startContainer);
			nodes.common.insertBefore(nodes.node, nodes.startContainer);

			// переносим элементы, которые находятся в текущем выделении в новый элемент
			nodes.next = nodes.startContainer;
			els.next = nodes.next.getElement();
			while (els.next && els.next.elementId !== els.endContainer.elementId)
			{
				nodes.buf = nodes.next.nextSibling;

				// ссылки на параграф и его дочерние элементы
				saveP = {
					el: nodes.next,
					children: []
				};

				// переносим элементы из параграфа в subtitle
				nodes.first = nodes.next.firstChild;
				els.first = nodes.first ? nodes.first.getElement() : null;
				while (els.first)
				{
					// ссылка на дочерний элемент параграфа
					saveP.children.push(nodes.first);

					els.node.add(els.first);
					nodes.node.appendChild(nodes.first);

					nodes.first = nodes.next.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
				}

				// удаляем параграф
				els.common.remove(els.next);
				nodes.common.removeChild(nodes.next);

				// сохраняем ссылки
				nodes.links.push(saveP);

				nodes.next = nodes.buf;
				els.next = nodes.next ? nodes.next.getElement() : null;
			}

			if (els.next && els.next.elementId === els.endContainer.elementId && !data.range.joinEndContainer)
			{
				// переносим элементы из параграфа в subtitle
				nodes.first = nodes.next.firstChild;
				els.first = nodes.first ? nodes.first.getElement() : null;
				while (els.first)
				{
					els.node.add(els.first);
					nodes.node.appendChild(nodes.first);

					nodes.first = nodes.next.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
				}

				els.common.remove(els.next);
				nodes.common.removeChild(nodes.next);
			}
		}
	}
);