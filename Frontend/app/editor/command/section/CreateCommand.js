/**
 * Создает секцию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.section.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData();

			nodes.node = data.node || data.prevNode;

			data.viewportId = nodes.node.viewportId;

			els.node = FBEditor.editor.Factory.createElement('section');
			els.title = FBEditor.editor.Factory.createElement('title');
			els.pT = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Заголовок');
			els.pT.add(els.t);
			els.title.add(els.pT);
			els.node.add(els.title);
			els.p = FBEditor.editor.Factory.createElement('p');
			els.t2 = FBEditor.editor.Factory.createElementText('Текст');
			els.p.add(els.t2);
			els.node.add(els.p);
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