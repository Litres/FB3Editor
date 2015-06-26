/**
 * Создает notes.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.notes.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		elementName: 'notes',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData();

			// корневой элемент
			nodes.parent = data.node;
			els.parent = nodes.parent.getElement();

			// создаем элемент
			els.node = FBEditor.editor.Factory.createElement(me.elementName);
			els = Ext.apply(els, els.node.createScaffold());
			nodes.node = els.node.getNode(data.viewportId);

			els.parent.add(els.node);
			nodes.parent.appendChild(nodes.node);
		}
	}
);