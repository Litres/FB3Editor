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
				factory = FBEditor.editor.Factory,
				viewportId = data.viewportId,
				size;

			size = data.opts.size;
			els.parent = els.node.getParent();
			els.node = els.parent.hisName(me.elementName) ? els.parent : els.node;
			els.parent = els.node.getParent();
			els.next = els.node.next();

			// создаем элемент
			els.node = factory.createElement(me.elementName);
			els = Ext.apply(els, els.node.createScaffold(size));

			if (els.next)
			{
				els.parent.insertBefore(els.node, els.next, viewportId);
			}
			else
			{
				els.parent.add(els.node, viewportId);
			}
		}
	}
);