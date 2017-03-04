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
				res = false,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				viewportId,
				manager,
				offset,
				range;

			try
			{
				if (data.saveRange)
				{
					// восстанваливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}

				range = sel.getRangeAt(0);

				offset = {
					start: range.startOffset,
					end: range.endOffset
				};

				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					collapsed: range.collapsed,
					offset: offset
				};

				nodes.node = range.startContainer;
				els.node = nodes.node.getElement();
				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				viewportId = data.viewportId = nodes.node.viewportId;

				console.log('edit text', data.newValue, els.node, range);

				data.oldValue = els.node.getText();
				els.node.setText(data.newValue, viewportId);
				els.node.sync(viewportId);

				manager.setCursor(
					{
						startNode: data.range.start,
						startOffset: offset.start,
						focusElement: els.node
					}
				);

				data.nodes = nodes;

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
				res = false,
				nodes = {},
				els = {},
				viewportId = data.viewportId,
				manager,
				sel,
				range,
				restoreRange;

			try
			{
				range = data.range;
				nodes = data.nodes;

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
					sel = window.getSelection();
					restoreRange = sel.getRangeAt(0);
					nodes.node = restoreRange.startContainer;
				}

				els.node = nodes.node.getElement();

				console.log('undo text', nodes, data);

				manager = els.node.getManager();
				manager.setSuspendEvent(true);
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