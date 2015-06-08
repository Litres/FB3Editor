/**
 * Абстрактная команда создания элемента редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {};

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				// создаем элемент
				me.createElement(els, nodes);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				me.setCursor(els, nodes);

				// сохраянем узел
				data.saveNode = nodes.node;
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
				els = {},
				nodes = {},
				sel = window.getSelection(),
				range,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				nodes.node = data.saveNode;
				els.node = nodes.node.getElement();
				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				range = data.oldRange;
				nodes.cursor = range.endContainer;
				els.cursor = nodes.cursor.getElement();
				FBEditor.editor.Manager.setFocusElement(els.cursor);
				sel.collapse(nodes.cursor, range.endOffset);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
		},

		/**
		 * Создает элемент.
		 * @param {Object} els Элементы.
		 * @param {Object} nodes Узлы.
		 */
		createElement: function (els, nodes)
		{
			//
		},

		/**
		 * Устанавливает курсор.
		 * @param {Object} els Элементы.
		 * @param {Object} nodes Узлы.
		 */
		setCursor: function (els, nodes)
		{
			var me = this,
				sel = window.getSelection(),
				data = me.getData();

			data.oldRange = sel.getRangeAt(0);
			FBEditor.editor.Manager.setFocusElement(els.p);
			nodes.p = els.p.nodes[data.viewportId];
			sel.collapse(nodes.p);
			sel.extend(nodes.p.firstChild, nodes.p.firstChild.length);
			sel.collapseToEnd();
		}
	}
);