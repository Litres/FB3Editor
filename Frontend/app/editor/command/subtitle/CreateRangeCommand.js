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
			console.log('Отмена subtitle нереализована');

			return false;
		},

		createNewElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.editor.Manager,
				factory = manager.getFactory();

			els.node = factory.createElement(me.elementName);
			nodes.node = els.node.getNode(data.viewportId);

			//console.log('nodes', nodes);
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