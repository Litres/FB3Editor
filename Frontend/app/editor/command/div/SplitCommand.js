/**
 * Команда разделения блока.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.div.SplitCommand',
	{
		extend: 'FBEditor.editor.command.AbstractSplitCommand',

		nameElement: 'div',

		createElement: function (nodes, els)
		{
			var me = this,
				data = me.getData();

			// переносим элементы, которые находятся в текущем выделении, из старого блока в новый
			if (!data.range.collapsed)
			{
				nodes.next = nodes.startContainer;
				els.next = nodes.next ? nodes.next.getElement() : null;
				nodes.parentNext = nodes.next.parentNode;
				els.parentNext = nodes.parentNext.getElement();
				while (nodes.next && els.next.elementId !== els.endContainer.elementId)
				{
					nodes.buf = nodes.next.nextSibling;

					els.node.add(els.next);
					nodes.node.appendChild(nodes.next);
					els.parentNext.remove(els.next);

					nodes.next = nodes.buf;
					els.next = nodes.next.getElement();
				}

				// создаем новый блок
				els.node = FBEditor.editor.Factory.createElement(me.nameElement);
				nodes.node = els.node.getNode(data.viewportId);
				if (nodes.nextPrevNode)
				{
					els.nextPrevNode = nodes.nextPrevNode.getElement();
					els.parent.insertBefore(els.node, els.nextPrevNode);
					nodes.parent.insertBefore(nodes.node, nodes.nextPrevNode);
				}
				else
				{
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}
			}
		},

		restoreElement: function (nodes, els, range)
		{
			var me = this;

			if (!range.collapsed)
			{
				nodes.next = nodes.prevNode.nextSibling;

				nodes.first = nodes.next.firstChild;
				me.moveNodes(nodes, els);

				// удаляем новый блок
				nodes.parent.removeChild(nodes.next);
				els.parent.remove(nodes.next.getElement());
			}
		}
	}
);