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
				data = me.getData(),
				viewportId = data.viewportId,
				factory = FBEditor.editor.Factory;

			// корневой элемент
			els.parent = data.node.getElement();

			// создаем элемент
			els.node = factory.createElement(me.elementName);
			els = Ext.apply(els, els.node.createScaffold());
			els.parent.add(els.node, viewportId);
		}
	}
);