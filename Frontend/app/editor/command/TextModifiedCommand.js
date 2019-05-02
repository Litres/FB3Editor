/**
 * Редактирует текстовый узел.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.TextModifiedCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		newValue: '',
		oldValue: '',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				range,
				offset,
				helper,
				manager,
				viewportId;

			try
			{
				console.log('exec text');
				
				nodes.node = data.node;
				els.node = nodes.node.getElement();
				manager = els.node.getManager();
				
				if (manager.isSuspendCmd())
				{
					return false;
				}
				
				me.newValue = me.newValue || data.newValue;
				me.oldValue = me.oldValue || els.node.getText();
				
				range = manager.getRangeCursor();
				
				// позиция курсора
				offset = me.offset = me.offset || range.offset.start;
				
				manager.setSuspendEvent(true);
				
				helper = els.node.getNodeHelper();
				
				// устанавливаем новый текст с учетом оверлея
				helper.setTextOverlay(nodes.node, me.newValue);
				
				// удаляем подсветку
				manager.removeAllOverlays();
				
				data.node = helper.getNode();
				viewportId = data.viewportId = data.node.viewportId;
				
				els.node.sync(viewportId);
				
				// устанавливаем курсор
				manager.setCursor(
					{
						withoutSyncButtons: true,
						startNode: data.node,
						startOffset: offset
					}
				);
				
				data.els = els;
				
				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.node).removeNext();
			}

			manager.setSuspendEvent(false);

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				manager,
				viewportId;

			try
			{
				console.log('undo exec text');

				nodes.node = data.node;
				viewportId = data.viewportId;
				els = data.els;
				manager = els.node.getManager();
				manager.setSuspendEvent(true);
				
				// восстанавливаем старый текст
				els.node.setText(me.oldValue, viewportId);
				
				els.node.sync(viewportId);

				// устанавливаем курсор
				manager.setCursor(
					{
						withoutSyncButtons: true,
						startNode: nodes.node,
						startOffset: me.offset - 1
					}
				);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.node).remove();
			}

			manager.setSuspendEvent(false);

			return res;
		}
	}
);