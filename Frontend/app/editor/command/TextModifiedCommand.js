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
				factory = FBEditor.editor.Factory,
				offset = sel.getRangeAt(0).startOffset,
				nodes = {},
				els = {},
				manager,
				node,
				text,
				viewportId,
				el;


			try
			{
				me.newValue = me.newValue || data.newValue;
				me.oldValue = me.oldValue || data.oldValue;
				me.offset = me.offset ? me.offset : offset;
				nodes.node = data.saveRange ? data.saveRange.startNode : data.node;
				els.node = nodes.node.getElement();
				manager = els.node.getManager();
				manager.setSuspendEvent(true);
				data.node = nodes.node;
                viewportId = data.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				//console.log(els.node, els.parent.getXml());

				if (els.node.isEmpty() && !els.node.isText)
				{
					// заменяем пустой элемент на текстовый
					els.text = factory.createElementText('');
					nodes.text = els.text.getNode(nodes.node.viewportId);

					els.parent.replace(els.text, els.node, viewportId);
					//nodes.parent.replaceChild(nodes.text, nodes.node);

					data.node = nodes.text;
				}

				node = data.node;
				text = me.newValue;

				console.log('exec text'/*, node, me.newValue, me.oldValue, 'offset=', me.offset*/);
				//console.log(els.parent.getXml());

				el = node.getElement();
				el.setText(text);

				el.sync(viewportId);

				// устанавливаем курсор
				/*manager.setCursor(
					{
						withoutSyncButtons: true,
						startNode: node,
						startOffset: me.offset
					}
				);*/

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(el).removeNext();
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
				node,
				text,
				viewportId,
				el;

			try
			{
				node = data.node;
				text = me.oldValue;
				viewportId = node.viewportId;
				el = node.getElement();
				manager = el.getManager();
				manager.setSuspendEvent(true);
				node.nodeValue = text;
				el.setText(text);
				nodes.parent = node.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.cursor = node;

				console.log('undo exec text', me.offset, node, el);

				if (!text && els.parent.isStyleHolder)
				{
					// вставляем пустой элемент

					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(viewportId);
					els.parent.replace(els.empty, el, viewportId);
					nodes.cursor = nodes.empty;
					els.parent.sync(viewportId);
				}
				else
				{
					el.sync(viewportId);
				}

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: me.offset - 1
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