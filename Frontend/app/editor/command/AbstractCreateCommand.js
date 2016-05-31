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
				nodes = {},
				manager,
				sel,
				range;

			try
			{
				// получаем данные из выделения
				sel = data.sel || window.getSelection();
				range = sel.getRangeAt(0);
				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					parentStart: range.startContainer.parentNode,
					collapsed: range.collapsed,
					offset: {
						start: range.startOffset,
						end: range.endOffset
					}
				};

				nodes.node = data.node || data.prevNode;
				els.node = nodes.node.getElement();

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				if (!nodes.node.parentNode)
				{
					// если ссылка на элемент была потеряна в результате многократного использования ctrl+z,
					// то пытаемся восстановить ссылку из текущего выделения
					nodes.parent = data.range.parentStart;
					els.parent = nodes.parent.getElement();
					while (els.parent.xmlTag !== nodes.node.getElement().xmlTag)
					{
						nodes.parent = nodes.parent.parentNode;
						els.parent = nodes.parent.getElement();
					}
					nodes.node = nodes.parent;
				}

				data.viewportId = nodes.node.viewportId;

				// создаем элемент
				me.createElement(els, nodes);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				// устанавливаем курсор
				me.setCursor(els, nodes);

				// сохраняем узел
				data.saveNode = nodes.node;

				// проверяем по схеме
				me.verifyElement(els.parent);

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
				els = {},
				nodes = {},
				manager,
				range,
				viewportId;

			try
			{
				range = data.range;

				nodes.node = data.saveNode;
				els.node = nodes.node.getElement();

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				els.parent.sync(viewportId);

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset.start,
					focusElement: range.parentStart.getElement()
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
				data = me.getData(),
				manager;

			data.oldRange = sel.getRangeAt(0);
			nodes.p = els.p.nodes[data.viewportId];
			data.saveRange = {
				startNode: nodes.p.firstChild,
				startOffset: nodes.p.firstChild.length
			};

			manager = els.p.getManager();
			manager.setCursor(data.saveRange);
		}
	}
);