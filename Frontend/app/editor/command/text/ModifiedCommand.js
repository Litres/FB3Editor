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
				manager = FBEditor.editor.Manager,
				offset,
				range;

			try
			{
				if (data.saveRange)
				{
					// восстанваливаем выделение
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

				data.viewportId = nodes.node.viewportId;

				console.log('text', data.newValue, range);

				manager.suspendEvent = true;

				data.oldValue = els.node.getText();
				els.node.setText(data.newValue);
				nodes.node.nodeValue = data.newValue;

				els.node.sync(data.viewportId);

				manager.suspendEvent = false;

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
				FBEditor.editor.HistoryManager.removeNext();
			}

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				manager = FBEditor.editor.Manager,
				sel,
				range,
				restoreRange;

			try
			{
				manager.suspendEvent = true;

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

				els.node.setText(data.oldValue);
				nodes.node.nodeValue = data.oldValue;

				els.node.sync(data.viewportId);

				manager.suspendEvent = false;

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
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
		}
	}
);