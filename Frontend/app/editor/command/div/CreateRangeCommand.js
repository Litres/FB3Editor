/**
 * Создает блок из выделения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.div.CreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				offset = {},
				sel,
				collapsed,
				range;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				sel = data.sel;

				// получаем данные из выделения
				sel = sel || window.getSelection();
				range = sel.getRangeAt(0);
				collapsed = range.collapsed;
				offset.start = range.startOffset;
				offset.end = range.endOffset;

				console.log('range', range);
				console.log('offset', offset);

				nodes.common = range.commonAncestorContainer;
				els.common = nodes.common.getElement();

				// ищем самый верхниий элемент, который может делиться на несколько
				while (!els.common.permit.splittable)
				{
					nodes.common = nodes.common.parentNode;
					els.common = nodes.common.getElement();
					if (els.common.xmlTag === 'fb3-body')
					{
						return false;
					}
				}

				data.viewportId = nodes.common.viewportId;

				nodes.startContainer = range.startContainer;
				nodes.endContainer = range.endContainer;

				// разбиваем конечный узел текущего выделения
				nodes.container = nodes.endContainer;
				nodes.endContainer = FBEditor.editor.Manager.splitNode(els, nodes, offset.end);

				// конечный узел текущего выделения
				if (collapsed)
				{
					nodes.startContainer = nodes.endContainer;
				}
				else
				{
					// разбиваем начальный узел текущего выделения
					nodes.container = nodes.startContainer;
					nodes.startContainer = FBEditor.editor.Manager.splitNode(els, nodes, offset.start);
				}

				els.startContainer = nodes.startContainer.getElement();
				els.endContainer = nodes.endContainer.getElement();

				// создаем новый блок
				els.node = FBEditor.editor.Factory.createElement('div');
				nodes.node = els.node.getNode(data.viewportId);

				console.log('nodes', nodes);
				console.log('els', els);

				// вставляем новый блок
				els.common.insertBefore(els.node, els.startContainer);
				nodes.common.insertBefore(nodes.node, nodes.startContainer);

				// переносим элементы, которые находятся в текущем выделении в новый блок
				nodes.next = nodes.startContainer;
				els.next = nodes.next.getElement();
				while (nodes.next && els.next.elementId !== els.endContainer.elementId)
				{
					nodes.buf = nodes.next.nextSibling;

					els.node.add(els.next);
					nodes.node.appendChild(nodes.next);
					els.common.remove(els.next);

					nodes.next = nodes.buf;
					els.next = nodes.next.getElement();
				}

				// синхронизируем
				els.common.sync(data.viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				nodes.cursor = nodes.node.firstChild;
				els.cursor = nodes.cursor.getElement();
				me.setCursor(els, nodes);

				// сохраянем узел
				//data.node = nodes.start;

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
			return false;
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
			FBEditor.editor.Manager.setFocusElement(els.cursor);
			sel.collapse(nodes.cursor);
		}
	}
);