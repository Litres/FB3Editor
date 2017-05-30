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
				sel = window.getSelection(),
				data = me.getData(),
				manager;

			data.oldRange = sel.getRangeAt(0);
			nodes.p = els.node.nodes[data.viewportId];
			data.saveRange = {
				withoutSyncButtons: true,
				startNode: nodes.p.firstChild,
				startOffset: nodes.p.firstChild.length
			};

			manager = els.node.getManager();
			manager.setCursor(data.saveRange);
		}
	}
);