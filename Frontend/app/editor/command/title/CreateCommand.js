/**
 * Создает заголовок.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.title.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				opts = data.opts || {},
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory;

			els.node = factory.createElement('title');

			if (opts.body)
			{
				// заголовок для всей книги
				els.parent = manager.getContent();
				nodes.parent = els.parent.nodes[data.viewportId];
			}
			else
			{
				nodes.parent = nodes.node.parentNode;
				nodes.node = nodes.parent.getElement().xmlTag === els.node.xmlTag ? nodes.parent : nodes.node;
				nodes.parent = nodes.node.parentNode;
			}

			nodes.first = nodes.parent.firstChild;
			els.parent = nodes.parent.getElement();
			els.p = factory.createElement('p');
			els.t = factory.createElementText('Заголовок');
			els.p.add(els.t);
			els.node.add(els.p);
			nodes.node = els.node.getNode(data.viewportId);

			if (nodes.first)
			{
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