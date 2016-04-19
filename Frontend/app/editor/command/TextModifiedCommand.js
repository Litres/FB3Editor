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
				sel = window.getSelection(),
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				offset = sel.getRangeAt(0).startOffset,
				nodes = {},
				els = {},
				node,
				text,
				viewportId,
				el;

			try
			{
				me.newValue = me.newValue || data.newValue;
				me.oldValue = me.oldValue || data.oldValue;
				me.offset = me.offset ? me.offset : offset;

				manager.suspendEvent = true;

				if (data.saveRange)
				{
					nodes.node = data.saveRange.startNode;
					els.node = nodes.node.getElement();

					data.node = nodes.node;

					nodes.parent = nodes.node.parentNode;
					els.parent = nodes.parent.getElement();

					if (els.node.isEmpty())
					{
						// заменяем пустой элемент на текстовый
						els.text = factory.createElementText('');
						nodes.text = els.text.getNode(nodes.node.viewportId);

						els.parent.replace(els.text, els.node);
						nodes.parent.replaceChild(nodes.text, nodes.node);

						data.node = nodes.text;
					}
				}

				node = data.node;
				text = me.newValue;
				viewportId = node.viewportId;

				//console.log('exec text', node, me.newValue, me.oldValue, 'offset=', me.offset);

				//node.nodeValue = text;
				el = node.getElement();
				el.setText(text);

				el.sync(viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				/*manager.setCursor(
					{
						startNode: node,
						startOffset: me.offset,
						focusElement: node.getElement()
					}
				);*/

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
				manager = FBEditor.editor.Manager,
				nodes = {},
				els = {},
				node,
				text,
				viewportId,
				el;

			try
			{
				node = data.node;
				text = me.oldValue;
				viewportId = node.viewportId;

				manager.suspendEvent = true;

				node.nodeValue = text;
				el = node.getElement();
				el.setText(text);

				nodes.parent = node.parentNode;
				els.parent = nodes.parent.getElement();

				nodes.cursor = node;

				//console.log('undo exec text', node, el);

				if (!text && els.parent.isStyleHolder)
				{
					// вставляем пустой элемент
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(viewportId);

					els.parent.replace(els.empty, el);
					nodes.parent.replaceChild(nodes.empty, node);

					nodes.cursor = nodes.empty;

					els.parent.sync(viewportId);
				}
				else
				{
					el.sync(viewportId);
				}

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: me.offset
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