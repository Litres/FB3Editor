/**
 * Создает эпиграф.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.epigraph.CreateCommand',
	{
		extend: 'FBEditor.editor.command.annotation.CreateCommand',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData();

			nodes.node = data.node || data.prevNode;
			data.viewportId = nodes.node.viewportId;

			els.node = FBEditor.editor.Factory.createElement('epigraph');
			nodes.parent = nodes.node.parentNode;
			nodes.node = nodes.parent.getElement().xmlTag === els.node.xmlTag ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			nodes.first = data.prevNode && data.prevNode.nextSibling ? data.prevNode : nodes.parent.firstChild;
			els.parent = nodes.parent.getElement();
			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Эпиграф');
			els.p.add(els.t);
			els.node.add(els.p);
			nodes.node = els.node.getNode(data.viewportId);
			if (nodes.first)
			{
				if (data.prevNode && data.prevNode.getElement().xmlTag === els.node.xmlTag)
				{
					// вставка после конкретного эпиграфа
					nodes.first = nodes.first.nextSibling;
				}
				else
				{
					// вставка после всех эпиграфов или заголовка
					nodes.next = nodes.first.nextSibling;
					while (nodes.next &&
					       (nodes.first.getElement().xmlTag === els.node.xmlTag ||
					        nodes.first.getElement().xmlTag === 'title'))
					{
						nodes.first = nodes.next;
						nodes.next = nodes.next.nextSibling;
					}
				}
				els.first = nodes.first.getElement();
				els.parent.insertBefore(els.node, els.first);
				nodes.parent.insertBefore(nodes.node, nodes.first);
			}
			else
			{
				els.parent.add(els.node);
				nodes.parent.appendChild(nodes.node);
			}
		}
	}
);