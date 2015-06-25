/**
 * Абстрактная команда создания элемента из выделения.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		/**
		 * @property {String} Имя элемента.
		 */
		elementName: null,

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
				range,
				joinStartContainer;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанваливаем выделение
					FBEditor.editor.Manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				sel = data.sel || window.getSelection();
				range = sel.getRangeAt(0);

				nodes.common = range.commonAncestorContainer;
				els.common = nodes.common.getElement();

				// ищем самый верхниий элемент, который может делиться на несколько
				while (!els.common.permit.splittable)
				{
					nodes.common = nodes.common.parentNode;
					els.common = nodes.common.getElement();
					if (els.common.isRoot)
					{
						return false;
					}
				}

				data.viewportId = nodes.common.viewportId;

				collapsed = range.collapsed;
				offset = {
					start: range.startOffset,
					end: range.endOffset
				};
				joinStartContainer = range.startOffset === 0 ?
				                     !FBEditor.editor.Manager.isFirstNode(nodes.common, range.startContainer) : true;
				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					prevParentStart: range.startContainer.parentNode.previousSibling,
					collapsed: collapsed,
					offset: offset,
					joinStartContainer: joinStartContainer
				};

				//console.log('range', data.range);

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
				els.node = FBEditor.editor.Factory.createElement(me.elementName);
				nodes.node = els.node.getNode(data.viewportId);

				//console.log('nodes', nodes);

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
				FBEditor.editor.Manager.setCursor(
					{
						startNode: nodes.node.firstChild,
						startOffset: 0,
						endNode: nodes.node.firstChild,
						endOffset: 0,
						focusElement: nodes.node.firstChild.getElement()
					}
				);

				// сохраянем узлы
				data.saveNodes = nodes;

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

				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;
				console.log('undo create range ' + me.elementName, range, nodes);

				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// переносим все элементы из блока обратно в исходный контейнер
				nodes.first = nodes.node.firstChild;
				while (nodes.first)
				{
					els.first = nodes.first.getElement();
					els.parent.insertBefore(els.first, els.node);
					//els.node.remove(els.first);
					nodes.parent.insertBefore(nodes.first, nodes.node);
					nodes.first = nodes.node.firstChild;
				}

				// удаляем новый блок
				nodes.parent.removeChild(nodes.node);
				els.parent.remove(els.node);

				// объединяем элементы в точках разделения
				if (range.joinStartContainer)
				{
					FBEditor.editor.Manager.joinNode(nodes.startContainer);
				}
				if (!range.collapsed)
				{
					FBEditor.editor.Manager.joinNode(nodes.endContainer);
				}

				// синхронизируем
				els.parent.sync(viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем выделение
				if (!range.joinStartContainer)
				{
					range.start = nodes.startContainer;
					range.common = range.start.getElement().isText ? range.start.parentNode : range.start;
				}
				else
				{
					range.common = range.common.getElement().isText ? range.common.parentNode : range.common;
				}
				range.common = range.common ? range.common : range.prevParentStart.parentNode;
				range.start = range.start.parentNode ? range.start : range.prevParentStart.nextSibling;
				range.end = range.collapsed || !range.end.parentNode ? range.start : range.end;
				range.end = !range.collapsed && range.end.firstChild ? range.end.firstChild : range.end;

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end,
					focusElement: range.common.getElement()
				};
				FBEditor.editor.Manager.setCursor(data.saveRange);

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