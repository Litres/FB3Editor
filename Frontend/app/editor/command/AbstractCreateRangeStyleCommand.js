/**
 * Абстрактная команда для создания элементов форматирования из выделения.
 * Элементы форматирования могут быть созданы в элементах p, li, subtitle.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateRangeStyleCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		/**
		 * @property {Array} Список элементов, которые могу содержать элементы форматирования.
		 */
		containers: ['p', 'li', 'subtitle'],

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				offset = {},
				reg = {},
				pos = {},
				sel,
				range;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				// получаем данные из выделения
				sel = data.sel || window.getSelection();
				range = sel.getRangeAt(0);

				nodes.common = range.commonAncestorContainer;
				els.common = nodes.common.getElement();
				data.viewportId = nodes.common.viewportId;

				offset = {
					start: range.startOffset,
					end: range.endOffset
				};
				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					prevParentStart: range.startContainer.parentNode.previousSibling,
					collapsed: range.collapsed,
					offset: offset
				};

				if (els.common.elementId === range.startContainer.getElement().elementId)
				{
					// выделен только текстовый узел

					nodes.parent = nodes.common.parentNode;
					els.parent = nodes.parent.getElement();
					nodes.next = nodes.common.nextSibling;

					// получаем части текста
					els.startValue = nodes.common.nodeValue.substring(0, offset.start);
					els.selValue = nodes.common.nodeValue.substring(offset.start, offset.end);
					els.endValue = nodes.common.nodeValue.substring(offset.end);

					// меняем текст исходного элемента
					els.common.setText(els.startValue);
					nodes.common.nodeValue = els.startValue;

					// новый элемент c выделенной частью текста
					els.node = FBEditor.editor.Factory.createElement(me.elementName);
					els = Ext.apply(els, els.node.createScaffold());
					els.t.setText(els.selValue);
					nodes.node = els.node.getNode(data.viewportId);

					if (nodes.next)
					{
						els.next = nodes.next.getElement();
						els.parent.insertBefore(els.node, els.next);
						nodes.parent.insertBefore(nodes.node, nodes.next);
					}
					else
					{
						els.parent.add(els.node);
						nodes.parent.appendChild(nodes.node);
					}

					// курсор
					nodes.cursor = nodes.node.firstChild;

					// новый текстовый элемент c последней частью текста
					if (els.endValue)
					{
						els.node = FBEditor.editor.Factory.createElementText(els.endValue);
						nodes.node = els.node.getNode(data.viewportId);

						if (nodes.next)
						{
							els.next = nodes.next.getElement();
							els.parent.insertBefore(els.node, els.next);
							nodes.parent.insertBefore(nodes.node, nodes.next);
						}
						else
						{
							els.parent.add(els.node);
							nodes.parent.appendChild(nodes.node);
						}
					}
				}
				else
				{
					// получаем все параграфы p (или li/subtitle), которые затрагивает текущее выделение

					// параграфы между первым и последним
					nodes.pp = [];

					// первый параграф
					nodes.firstP = range.startContainer;
					els.firstP = nodes.firstP.getElement();
					while (!Ext.Array.contains(me.containers, els.firstP.xmlTag))
					{
						nodes.firstP = nodes.firstP.parentNode;
						els.firstP = nodes.firstP.getElement();
					}

					// последний параграф
					nodes.lastP = range.endContainer;
					els.lastP = nodes.lastP.getElement();
					while (!Ext.Array.contains(me.containers, els.lastP.xmlTag))
					{
						nodes.lastP = nodes.lastP.parentNode;
						els.lastP = nodes.lastP.getElement();
					}

					// находим список параграфов между первым и последним
					nodes.next = els.firstP.elementId !== els.lastP.elementId ? nodes.firstP.nextSibling : null;
					els.next = nodes.next ? nodes.next.getElement() : null;
					while (els.next && els.next.elementId !== els.lastP.elementId)
					{
						nodes.pp.push(nodes.next);
						nodes.next = nodes.next.nextSibling;
						els.next = nodes.next ? nodes.next.getElement() : null;
					}

					// регулярные выражения для определения позиции выделения
					reg.start = new RegExp('^' + Ext.String.escapeRegex(range.toString()));
					reg.start2 = new RegExp('^' + Ext.String.escapeRegex(nodes.firstP.innerText));
					reg.end = new RegExp(Ext.String.escapeRegex(range.toString()) + '$');
					reg.end2 = new RegExp(Ext.String.escapeRegex(nodes.lastP.innerText) + '$');

					// позиции выделения относительно затронутых элементов

					// находится ли начальная точка выделения в начале первого параграфа
					pos.isStart = reg.start.test(nodes.firstP.innerText) || reg.start2.test(range.toString());

					// находится ли конечная точка выделения в конце первого параграфа
					pos.isEnd = reg.end.test(nodes.lastP.innerText) || reg.end2.test(range.toString());

					console.log('pos, range', pos, range.toString());

					if (pos.isStart)
					{
						// начальная точка выделения находится в начале параграфа, разделение узла не требуется
						nodes.startContainer = nodes.firstP.firstChild;
						els.startContainer = nodes.startContainer.getElement();
					}
					else
					{
						// разбиваем первый узел на два в точке начального выделения
						nodes.common = nodes.firstP;
						els.common = els.firstP;
						nodes.container = range.startContainer;
						nodes.startContainer = FBEditor.editor.Manager.splitNode(els, nodes, offset.start);
						els.startContainer = nodes.startContainer.getElement();
					}

					nodes.parentStart = nodes.startContainer.parentNode;
					els.parentStart = nodes.parentStart.getElement();

					if (pos.isEnd)
					{
						// конечная точка выделения находится в конце параграфа, разделение узла не требуется
						nodes.endContainer = nodes.lastP.lastChild;
						els.endContainer = nodes.endContainer.getElement();
					}
					else
					{
						// разбиваем последний узел на два в точке конечного выделения
						nodes.common = nodes.lastP;
						els.common = els.lastP;
						nodes.container = range.endContainer;
						nodes.endContainer = FBEditor.editor.Manager.splitNode(els, nodes, offset.end);
						els.endContainer = nodes.endContainer.getElement();
					}

					nodes.parentEnd = nodes.endContainer.parentNode;
					els.parentEnd = nodes.parentEnd.getElement();

					if (!nodes.endContainer.firstChild && !els.endContainer.isText)
					{
						// если точка конечного выделения ссылается на пустой элемент
						// перемещаем ее на следующий или предыдущий элемент, а пустой элемент удаляем

						nodes.bufRemove = nodes.endContainer;
						nodes.endContainer = nodes.endContainer.nextSibling ?
						                     nodes.endContainer.nextSibling : nodes.endContainer.previousSibling;

						nodes.parentEnd.removeChild(nodes.bufRemove);
						els.parentEnd.remove(nodes.bufRemove.getElement());

						els.endContainer = nodes.endContainer.getElement();
					}

					// новый элемент в первом параграфе
					els.node = FBEditor.editor.Factory.createElement(me.elementName);
					nodes.node = els.node.getNode(data.viewportId);
					els.parentStart.insertBefore(els.node, els.startContainer);
					nodes.parentStart.insertBefore(nodes.node, nodes.startContainer);

					// заполняем новый элемент в первом параграфе
					nodes.next = nodes.node.nextSibling;
					els.next = nodes.next ? nodes.next.getElement() : null;
					while (els.next && (els.next.elementId !== els.endContainer.elementId || pos.isEnd))
					{
						// выполняется до тех пор, пока не закончится параграф или не встретится конечный элемент
						els.node.add(els.next);
						nodes.node.appendChild(nodes.next);
						els.parentStart.remove(els.next);
						nodes.next = nodes.node.nextSibling;
						els.next = nodes.next ? nodes.next.getElement() : null;
					}

					//console.log('nodes', nodes); return false;

					// начальные и конечные точки выделения находятся в разных параграфах
					if (els.parentStart.elementId !== els.parentEnd.elementId)
					{
						nodes.prev = nodes.endContainer.previousSibling;

						// новый элемент в последнем параграфе
						els.node = FBEditor.editor.Factory.createElement(me.elementName);
						nodes.node = els.node.getNode(data.viewportId);
						nodes.first = nodes.parentEnd.firstChild;
						els.first = nodes.first.getElement();
						els.parentEnd.insertBefore(els.node, els.first);
						nodes.parentEnd.insertBefore(nodes.node, nodes.first);

						// заполняем новый элемент в последнем параграфе
						nodes.next = nodes.node.nextSibling;
						els.next = nodes.next ? nodes.next.getElement() : null;
						while (els.next && (els.next.elementId !== els.endContainer.elementId || pos.isEnd))
						{
							// выполняется до тех пор, пока не закончится параграф или не встретится конечный элемент
							els.node.add(els.next);
							nodes.node.appendChild(nodes.next);
							els.parentEnd.remove(els.next);
							nodes.next = nodes.node.nextSibling;
							els.next = nodes.next ? nodes.next.getElement() : null;
						}
					}

					// перебираем все параграфы, которые входят в выделение между первым и последним параграфами
					// и изменяем их содержимое
					Ext.Array.each(
						nodes.pp,
						function (p)
						{
							var elsP = {},
								nodesP = {};

							nodesP.p = p;
							elsP.p = nodesP.p.getElement();

							// новый элемент в параграфе
							elsP.node = FBEditor.editor.Factory.createElement(me.elementName);
							nodesP.node = elsP.node.getNode(data.viewportId);
							nodesP.first = nodesP.p.firstChild;
							elsP.first = nodesP.first.getElement();
							elsP.p.insertBefore(elsP.node, elsP.first);
							nodesP.p.insertBefore(nodesP.node, nodesP.first);

							// заполняем новый элемент
							nodesP.next = nodesP.node.nextSibling;
							while (nodesP.next)
							{
								// выполняется до тех пор, пока не закончится параграф

								elsP.next = nodesP.next.getElement();
								elsP.node.add(elsP.next);
								nodesP.node.appendChild(nodesP.next);
								elsP.p.remove(elsP.next);
								nodesP.next = nodesP.node.nextSibling;
							}
						}
					);

					// родительский элемент параграфов
					nodes.parent = nodes.parentStart.parentNode;
					els.parent = nodes.parent.getElement();

					// курсор
					nodes.cursor = pos.isEnd ? nodes.endContainer : nodes.endContainer.previousSibling;
					els.cursor = nodes.cursor.getElement();
					while (els.cursor && !els.cursor.isText)
					{
						nodes.cursor = nodes.cursor.lastChild;
						els.cursor = nodes.cursor ? nodes.cursor.getElement() : null;
					}
				}

				console.log('nodes, els', nodes, els);

				// синхронизируем
				els.parent.sync(data.viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: nodes.cursor.nodeValue.length,
						focusElement: nodes.cursor.parentNode.getElement()
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

			return false;

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

				//console.log('cursor range', range);

				FBEditor.editor.Manager.setCursor(
					{
						startNode: range.start,
						endNode: range.end,
						startOffset: range.offset.start,
						endOffset: range.offset.end,
						focusElement: range.common.getElement()
					}
				);

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