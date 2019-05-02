/**
 * Редактирует текст.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.text.ModifiedCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				res = false,
				nodes = {},
				els = {},
				viewportId,
				range;

			try
			{
				if (manager.isSuspendCmd())
				{
					return false;
				}
				
				if (data.saveRange)
				{
					// восстанваливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}
				
				// получаем данные из выделения
				range = data.range = manager.getRange();
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();

				nodes.node = range.start;
				els.node = nodes.node.getElement();
				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				viewportId = data.viewportId = nodes.node.viewportId;

				console.log('edit text'/*, data.newValue, els.node, range*/);

				data.oldValue = els.node.getText();
				els.node.setText(data.newValue, viewportId);
				els.node.sync(viewportId);

				manager.setCursor(
					{
						withoutSyncButtons: true,
						startNode: range.start,
						startOffset: range.offset.start,
						focusElement: els.node
					}
				);

				data.nodes = nodes;
				data.els = els;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
			}

			manager.setSuspendEvent(false);

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				res = false,
				nodes = {},
				els = {},
				manager,
				sel,
				range,
				restoreRange;

			try
			{
				range = data.range;
				nodes = data.nodes;
				els = data.els;
				manager = els.node.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);

				// действительна ли родительская ссылка
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent ? nodes.parent.getElement() : null;
				while (els.parent && !els.parent.isRoot)
				{
					nodes.parent = nodes.parent.parentNode;
					els.parent = nodes.parent ? nodes.parent.getElement() : null;
				}

				if (!els.parent || !els.parent.isRoot)
				{
					// восстанавливаем ссылку из выделения
					restoreRange = manager.getRangeCursor();
					nodes.node = restoreRange.start;
				}

				els.node = nodes.node.getElement();

				console.log('undo text', nodes, data);

				els.node.setText(data.oldValue, viewportId);
				els.node.sync(viewportId);

				// курсор
				nodes.startCursor = data.isBackspace ? range.offset.start + 1 : range.offset.start;
				data.saveRange = {
					startNode: nodes.node,
					startOffset: nodes.startCursor,
					focusElement: els.node
				};
				manager.setCursor(data.saveRange);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);

			return res;
		}
	}
);