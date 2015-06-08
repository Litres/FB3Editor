/**
 * Создает заголовок.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.title.CreateCommand',
	{
		extend: 'FBEditor.editor.command.annotation.CreateCommand',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData();

			nodes.node = data.node;

			data.viewportId = nodes.node.viewportId;

			els.node = FBEditor.editor.Factory.createElement('title');
			nodes.parent = nodes.node.parentNode;
			nodes.node = nodes.parent.getElement().xmlTag === els.node.xmlTag ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			nodes.first = nodes.parent.firstChild;
			els.parent = nodes.parent.getElement();
			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Заголовок');
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