/**
 * Создает subtitle.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.subtitle.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateUnboundedCommand',

		elementName: 'subtitle',
		
		setCursor: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				helper,
				manager;
			
			manager = els.node.getManager();
			data.oldRange = manager.getRangeCursor();
			
			els.start = els.node.first();
			helper = els.start.getNodeHelper();
			nodes.start = helper.getNode();
			
			data.saveRange = {
				withoutSyncButtons: true,
				startNode: nodes.start,
				startOffset: els.start.getLength()
			};

			manager.setCursor(data.saveRange);
		}
	}
);