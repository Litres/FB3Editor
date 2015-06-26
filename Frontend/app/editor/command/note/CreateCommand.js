/**
 * Создает note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.note.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		elementName: 'note',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData();

			nodes.parent = nodes.node.parentNode;
			nodes.node = nodes.parent.getElement().isNote ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.next = nodes.node.nextSibling;

			// создаем элемент
			els.node = FBEditor.editor.Factory.createElement(me.elementName);
			els = Ext.apply(els, els.node.createScaffold());
			nodes.node = els.node.getNode(data.viewportId);

			if (nodes.next)
			{
				els.next = nodes.next.getElement();
				els.parent.insertBefore(els.node, els.next);
				nodes.parent.insertBefore(nodes.node, nodes.next);
			}
			else
			{
				els.parent.add(els.node);
				nodes.parent.appendChild(nodes.node);
			}
		}
	}
);