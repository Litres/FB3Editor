/**
 * Команда создания table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateUnboundedCommand',

		elementName: 'table',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.editor.Manager,
				factory = manager.getFactory(),
				size;

			size = data.opts.size;

			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.node = els.parent.hisName(me.elementName) ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.next = nodes.node.nextSibling;

			// создаем элемент
			els.node = factory.createElement(me.elementName);
			els = Ext.apply(els, els.node.createScaffold(size));
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