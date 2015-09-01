/**
 * Команда разделения секции на две.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.section.SplitCommand',
	{
		extend: 'FBEditor.editor.command.AbstractSplitCommand',

		elementName: 'section',

		createElement: function (nodes, els)
		{
			var me = this,
				data = me.getData();

			// формируем заголовок новой секции
			if (!data.range.collapsed)
			{
				// создаем заголовок
				els.title = FBEditor.editor.Factory.createElement('title');
				els.node.add(els.title);
				nodes.title = els.title.getNode(data.viewportId);
				nodes.node.appendChild(nodes.title);

				// переносим элементы, которые выделены, из старой секции в заголовок
				nodes.next = nodes.startContainer;
				els.next = nodes.next.getElement();
				nodes.parentNext = nodes.next.parentNode;
				els.parentNext = nodes.parentNext.getElement();
				while (els.next && els.next.elementId !== els.endContainer.elementId)
				{
					nodes.buf = nodes.next.nextSibling;

					els.title.add(els.next);
					nodes.title.appendChild(nodes.next);

					nodes.next = nodes.buf;
					els.next = nodes.next ? nodes.next.getElement() : null;
				}

				nodes.cursor = nodes.title;
			}
		},

		restoreElement: function (nodes, els, range)
		{
			var me = this,
				data = me.getData();

			if (nodes.title)
			{
				// переносим элементы из заголовка
				els.title = nodes.title.getElement();
				nodes.first = nodes.title.firstChild;
				while (nodes.first)
				{
					els.first = nodes.first.getElement();
					nodes.prevNode.appendChild(nodes.first);
					els.prevNode.add(els.first);
					els.title.remove(els.first);
					nodes.first = nodes.title.firstChild;
				}

				// удаляем заголовок
				nodes.node.removeChild(nodes.title);
				els.node.remove(els.title);
			}
		}
	}
);