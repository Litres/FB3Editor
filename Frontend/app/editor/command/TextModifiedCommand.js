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
				offset = sel.getRangeAt(0).startOffset,
				node,
				text,
				viewportId,
				el;

			try
			{
				me.newValue = me.newValue || data.newValue;
				me.oldValue = me.oldValue || data.oldValue;
				me.offset = me.offset ? me.offset : offset;
				node = data.node;
				text = me.newValue;
				viewportId = node.viewportId;
				console.log('exec text', node, me.newValue, me.oldValue, me.offset);
				FBEditor.editor.Manager.suspendEvent = true;
				node.nodeValue = text;
				el = node.getElement();
				el.setText(text);
				el.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				sel.collapse(node);
				sel.extend(node, me.offset);
				sel.collapseToEnd();

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
				sel = window.getSelection(),
				node,
				text,
				viewportId,
				el;

			try
			{
				node = data.node;
				text = me.oldValue;
				viewportId = node.viewportId;
				FBEditor.editor.Manager.suspendEvent = true;
				node.nodeValue = text;
				el = node.getElement();
				console.log('unexec text', node, el);
				el.setText(text);
				el.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				sel.collapse(node);
				if (sel)
				{
					sel.extend(node, me.offset - 1);
					sel.collapseToEnd();
				}

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