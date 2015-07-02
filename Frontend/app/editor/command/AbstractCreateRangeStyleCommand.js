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
				containers,
				sel,
				range;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанвливаем выделение
					FBEditor.editor.Manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				sel = data.sel || window.getSelection();
				range = sel.getRangeAt(0);

				if (range.collapsed)
				{
					return false;
				}

				containers = FBEditor.editor.Manager.getStyleContainers();

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
					parentStart: range.startContainer.parentNode,
					collapsed: range.collapsed,
					offset: offset
				};

				//console.log('range', range);

				if (els.common.isText)
				{
					// выделен только текстовый узел

					data.range.oldValue = nodes.common.nodeValue;

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
					els.isRoot = els.firstP.isRoot;
					while (els.firstP && !Ext.Array.contains(containers, els.firstP.xmlTag))
					{
						nodes.firstP = els.isRoot ? nodes.firstP.firstChild : nodes.firstP.parentNode;
						els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;
					}

					// последний параграф
					nodes.lastP = range.endContainer;
					els.lastP = nodes.lastP.getElement();
					while (els.lastP && !Ext.Array.contains(containers, els.lastP.xmlTag))
					{
						nodes.lastP = els.isRoot ? nodes.lastP.lastChild : nodes.lastP.parentNode;
						els.lastP = nodes.lastP ? nodes.lastP.getElement() : null;
					}

					// находим список параграфов между первым и последним
					if (els.firstP.elementId !== els.lastP.elementId)
					{
						nodes.ppStop = false;
						nodes.cur = nodes.firstP;
						while (!nodes.cur.nextSibling)
						{
							nodes.cur = nodes.cur.parentNode;
						}
						nodes.pp = FBEditor.editor.Manager.getNodesPP(nodes.cur.nextSibling, nodes, els);
					}

					// регулярные выражения для определения позиции выделения
					reg.start = new RegExp('^' + Ext.String.escapeRegex(range.toString()));
					reg.start2 = new RegExp('^' + Ext.String.escapeRegex(els.firstP.getText()));
					reg.end = new RegExp(Ext.String.escapeRegex(range.toString()) + '$');
					reg.end2 = new RegExp(Ext.String.escapeRegex(els.lastP.getText()) + '$');

					// находится ли начальная точка выделения в начале первого параграфа
					pos.isStart = reg.start.test(els.firstP.getText()) || reg.start2.test(range.toString());

					// находится ли конечная точка выделения в конце первого параграфа
					pos.isEnd = reg.end.test(els.lastP.getText()) || reg.end2.test(range.toString());

					data.range.pos = pos;
					//console.log('pos', pos);

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

					nodes.endContainer = els.isRoot ? nodes.lastP.lastChild : range.endContainer;
					els.endContainer = nodes.endContainer.getElement();
					nodes.parentEnd = nodes.endContainer.parentNode;
					els.parentEnd = nodes.parentEnd.getElement();

					if (pos.isEnd)
					{
						// конечная точка выделения находится в конце параграфа, разделение узла не требуется
						nodes.endContainer = nodes.lastP.lastChild;
					}
					else if (els.endContainer.isText && els.parentEnd.elementId === els.lastP.elementId &&
					         data.range.offset.end === els.endContainer.text.length)
					{
						// конечная точка выделения находится в конце текстового узла,
						// который является прямым потомком параграфа

						// указатель на элемент в конечной точке выделения
						nodes.endContainer = nodes.endContainer.nextSibling ?
						                     nodes.endContainer.nextSibling : nodes.endContainer;
					}
					else
					{
						// разбиваем последний узел на два в точке конечного выделения
						nodes.common = nodes.lastP;
						els.common = els.lastP;
						nodes.container = nodes.endContainer;
						nodes.endContainer = FBEditor.editor.Manager.splitNode(els, nodes, offset.end);
					}
					els.endContainer = nodes.endContainer.getElement();


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

				//console.log('nodes, els', nodes, els);

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
				range,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;

				nodes.common = range.common;
				els.common = nodes.common.getElement();

				console.log('undo create ' + me.elementName, range, nodes);

				if (els.common.elementId === range.start.getElement().elementId)
				{
					// был выделен только текстовый узел

					nodes.parent = nodes.common.parentNode;
					els.parent = nodes.parent.getElement();

					// меняем текст исходного элемента
					els.common.setText(range.oldValue);
					nodes.common.nodeValue = range.oldValue;

					// удаляем новые узлы
					nodes.next = nodes.common.nextSibling;
					els.next = nodes.next.getElement();
					els.parent.remove(els.next);
					nodes.parent.removeChild(nodes.next);
					if (range.offset.end < range.oldValue.length)
					{
						nodes.next = nodes.common.nextSibling;
						els.next = nodes.next.getElement();
						els.parent.remove(els.next);
						nodes.parent.removeChild(nodes.next);
					}
				}
				else
				{
					// переносим элементы в первом параграфе
					els.firstP = nodes.firstP.getElement();
					nodes.parent = nodes.startContainer.parentNode;
					els.parent = nodes.parent.getElement();
					nodes.first = nodes.parent.firstChild;
					while (nodes.first)
					{
						// выполняется до тех пор, пока не закончатся элементы
						els.first = nodes.first.getElement();
						els.firstP.insertBefore(els.first, els.parent);
						nodes.firstP.insertBefore(nodes.first, nodes.parent);
						els.parent.remove(els.first);
						nodes.first = nodes.parent.firstChild;
					}

					// удаляем новый элемент из первого параграфа
					els.firstP.remove(els.parent);
					nodes.firstP.removeChild(nodes.parent);

					if (range.offset.start)
					{
						// соединяем узлы первого параграфа
						FBEditor.editor.Manager.joinNode(nodes.startContainer);
					}

					els.lastP = nodes.lastP.getElement();
					if (els.firstP.elementId !== els.lastP.elementId)
					{
						// начальные и конечные точки выделения находятся в разных параграфах

						// переносим элементы в последнем параграфе
						els.lastP = nodes.lastP.getElement();
						nodes.parent = nodes.lastP.firstChild;
						els.parent = nodes.parent.getElement();
						nodes.first = nodes.parent.firstChild;
						while (nodes.first)
						{
							// выполняется до тех пор, пока не закончатся элементы
							els.first = nodes.first.getElement();
							els.lastP.insertBefore(els.first, els.parent);
							nodes.lastP.insertBefore(nodes.first, nodes.parent);
							els.parent.remove(els.first);
							nodes.first = nodes.parent.firstChild;
						}

						// удаляем новый элемент из последнего параграфа
						els.lastP.remove(els.parent);
						nodes.lastP.removeChild(nodes.parent);
					}

					if (range.offset.end < range.end.length)
					{
						// соединяем узлы последнего параграфа
						FBEditor.editor.Manager.joinNode(nodes.endContainer);
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

							// переносим все дочерние элементы из нового элемента
							nodesP.parent = nodesP.p.firstChild;
							elsP.parent = nodesP.parent.getElement();
							nodesP.first = nodesP.parent.firstChild;
							while (nodesP.first)
							{
								// выполняется до тех пор, пока не закончатся элементы
								elsP.first = nodesP.first.getElement();
								elsP.p.add(elsP.first);
								nodesP.p.appendChild(nodesP.first);
								elsP.parent.remove(elsP.first);
								nodesP.first = nodesP.parent.firstChild;
							}

							// удаляем новый элемент
							elsP.p.remove(elsP.parent);
							nodesP.p.removeChild(nodesP.parent);
						}
					);

					// для синхронизации и курсора
					els.parent = els.common;
				}

				// синхронизируем
				els.parent.sync(viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end,
					focusElement: els.parent
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