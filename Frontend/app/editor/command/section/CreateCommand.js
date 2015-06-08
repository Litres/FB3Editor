/**
 * Создает секцию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.section.CreateCommand',
	{
		extend: 'FBEditor.editor.command.annotation.CreateCommand',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				el;

			nodes.node = data.node || data.prevNode;

			data.viewportId = nodes.node.viewportId;

			el = FBEditor.editor.Factory.createElement('section');
			els = Ext.apply(els, el.createScaffold());
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.next = nodes.node.nextSibling;
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