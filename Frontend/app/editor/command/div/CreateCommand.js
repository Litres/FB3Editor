/**
 * Создает блок.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.div.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData();

			nodes.node = data.node || data.prevNode;
			data.viewportId = nodes.node.viewportId;

			els.node = FBEditor.editor.Factory.createElement('div');
			nodes.parent = nodes.node.parentNode;
			nodes.node = nodes.parent.getElement().xmlTag === els.node.xmlTag ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			nodes.next = nodes.node.nextSibling;
			els.parent = nodes.parent.getElement();
			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Блок');
			els.p.add(els.t);
			els.node.add(els.p);
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