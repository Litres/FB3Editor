/**
 * Создает notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.notebody.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		elementName: 'notebody',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				factory = FBEditor.editor.Factory;

			nodes.parent = nodes.node.parentNode;
			nodes.node = nodes.parent.getElement().isNote ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.next = nodes.node.nextSibling;

			// создаем элемент
			els.node = factory.createElement(me.elementName);
			els = Ext.apply(els, els.node.createScaffold());

			if (nodes.next)
			{
				els.next = nodes.next.getElement();
				els.parent.insertBefore(els.node, els.next, viewportId);
			}
			else
			{
				els.parent.add(els.node, viewportId);
			}
			
			// генерируем новый id для сноски
			els.node.generateNoteId();
		}
	}
);