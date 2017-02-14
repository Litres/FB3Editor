/**
 * Абстрактная команда для создания элементов форматирования (стилевые элементы) из выделения.
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
				factory = FBEditor.editor.Factory,
				attributes,
				manager,
				sel,
				range;

			try
			{
				if (data.saveRange)
				{
					// восстанвливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				sel = data.sel || window.getSelection();
				range = sel.getRangeAt(0);

				if (range.collapsed)
				{
					throw Error('Отсутствует выделение');
				}

				// аттрибуты создаваемого элемента
				attributes = data.opts && data.opts.attributes ? data.opts.attributes : [];

				nodes.common = range.commonAncestorContainer;
				els.common = nodes.common.getElement();
				data.viewportId = nodes.common.viewportId;

				manager = manager || els.common.getManager();
				manager.setSuspendEvent(true);

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
				data.links = {};

				//console.log('range', range);

				if (els.common.isText)
				{
					// выделен только текстовый узел

					data.range.oldValue = nodes.common.nodeValue;

					nodes.parent = nodes.common.parentNode;
					els.parent = nodes.parent.getElement();

					data.links.parent = nodes.parent;

					nodes.next = nodes.common.nextSibling;

					// получаем части текста
					els.startValue = nodes.common.nodeValue.substring(0, offset.start);
					els.selValue = nodes.common.nodeValue.substring(offset.start, offset.end);
					els.endValue = nodes.common.nodeValue.substring(offset.end);

					if (els.startValue)
					{
						// меняем текст исходного элемента
						els.common.setText(els.startValue);
						nodes.common.nodeValue = els.startValue;
					}
					else
					{
						// удаляем пустой элемент
						els.parent.remove(els.common);
						nodes.parent.removeChild(nodes.common);
					}

					// новый элемент c выделенной частью текста
					els.node = factory.createElement(me.elementName, attributes);
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

					data.links.newNode = nodes.node;

					// курсор
					nodes.cursor = nodes.node.firstChild;

					// новый текстовый элемент c последней частью текста
					if (els.endValue)
					{
						els.node = factory.createElementText(els.endValue);
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
					while (els.firstP && !els.firstP.isStyleHolder)
					{
						nodes.firstP = els.isRoot ? nodes.firstP.firstChild : nodes.firstP.parentNode;
						els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;
					}

					// последний параграф
					nodes.lastP = range.endContainer;
					els.lastP = nodes.lastP.getElement();
					while (els.lastP && !els.lastP.isStyleHolder)
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
						nodes.pp = manager.getNodesPP(nodes.cur.nextSibling, nodes, els);
					}

					// регулярные выражения для определения позиции выделения
					reg.start = new RegExp('^' + Ext.String.escapeRegex(range.toString()));
					reg.start2 = new RegExp('^' + Ext.String.escapeRegex(els.firstP.getText()));
					reg.end = new RegExp(Ext.String.escapeRegex(range.toString()) + '$');
					reg.end2 = new RegExp(Ext.String.escapeRegex(els.lastP.getText()) + '$');

					// находится ли начальная точка выделения в начале первого параграфа
					pos.isStart = reg.start.test(els.firstP.getText()) || reg.start2.test(range.toString());

					// находится ли конечная точка выделения в конце последнего параграфа
					pos.isEnd = reg.end.test(els.lastP.getText()) || reg.end2.test(range.toString());

					data.range.pos = pos;
					//console.log('pos', pos, range.toString());

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
						nodes.startContainer = manager.splitNode(els, nodes, offset.start);
						els.startContainer = nodes.startContainer.getElement();
						els.common.removeEmptyText();
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
						nodes.endContainer = manager.splitNode(els, nodes, offset.end);
						els.common.removeEmptyText();
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
					els.node = factory.createElement(me.elementName, attributes);
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
						els.node = factory.createElement(me.elementName, attributes);
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
							elsP.node = factory.createElement(me.elementName, attributes);
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

				//console.log('nodes, els', nodes, els, data.links);

				// соединяет соседние однотипные стилевые элементы
				me.joinEqualSibling(els.parent);

				//console.log('data.mapJoinEqual', data.mapJoinEqual);

				// удаляет однотипные вложенные друг в друга стилевые элементы
				me.removeEqualInner(els.parent);

				//console.log('data.mapRemoveEqual', data.mapRemoveEqual);

				// синхронизируем
				els.parent.sync(data.viewportId);

				manager.setSuspendEvent(false);

				els.focus = nodes.cursor.parentNode.getElement();

				// сохраняем айди, чтобы избежать двойной синхронизации кнопок
				manager.cashSyncBtn = els.focus.elementId;

				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: nodes.cursor.nodeValue.length,
						focusElement: els.focus
					}
				);

				// сохраняем узлы
				data.saveNodes = nodes;

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
				factory = FBEditor.editor.Factory,
				manager,
				range,
				viewportId;

			try
			{
				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;

				nodes.common = range.common;
				els.common = nodes.common.getElement();

				manager = els.common.getManager();
				manager.setSuspendEvent(true);

				console.log('undo create ' + me.elementName, data, nodes);

				if (data.mapRemoveEqual)
				{
					// восстанавливаем удаленные вложенные элементы
					me.unRemoveEqualInner();
				}

				if (data.mapJoinEqual)
				{
					// разъединяем соединенные однотипные соседние элементы
					me.unJoinEqualSibling(nodes.parent.getElement());
				}

				if (els.common.elementId === range.start.getElement().elementId)
				{
					// был выделен только текстовый узел

					nodes.parent = nodes.common.parentNode || data.links.parent;
					els.parent = nodes.parent.getElement();

					if (nodes.common.parentNode)
					{
						// меняем текст исходного элемента
						els.common.setText(range.oldValue);
						nodes.common.nodeValue = range.oldValue;
					}
					else
					{
						// создаем текстовый узел
						els.common = factory.createElementText(range.oldValue);
						nodes.common = els.common.getNode(data.viewportId);

						nodes.newNode = data.links.newNode;
						els.newNode = nodes.newNode.getElement();
						els.parent.insertBefore(els.common, els.newNode);
						nodes.parent.insertBefore(nodes.common, nodes.newNode);

						range.start = nodes.common;
						range.end = nodes.common;
					}

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
						manager.joinNode(nodes.startContainer);
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
						manager.joinNode(nodes.endContainer);
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

				manager.setSuspendEvent(false);

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end,
					focusElement: els.parent
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
		 * @private
		 * Соединяет соседние однотипные стилевые элементы.
		 * @param {FBEditor.editor.element.AbstractElement} el Родительский элемент, относительно которого
		 * начинается проверка.
		 */
		joinEqualSibling: function (el)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				els = {},
				nodes = {},
				map,
				helper;

			if (el.isStyleFormat && el.next() && el.getName() === el.next().getName())
			{
				// соединяем соседние элементы

				map = {
					el: el,
					next: el.next(),
					child: []
				};

				helper = el.getNodeHelper();
				nodes.el = helper.getNode(viewportId);

				els.next = el.next();
				helper = els.next.getNodeHelper();
				nodes.next = helper.getNode(viewportId);

				els.first = els.next.first();

				while (els.first)
				{
					helper = els.first.getNodeHelper();
					nodes.first = helper.getNode(viewportId);

					map.child.push(els.first);

					el.add(els.first);
					nodes.el.appendChild(nodes.first);

					els.first = els.next.first();
				}

				helper = el.parent.getNodeHelper();
				nodes.parent = helper.getNode(viewportId);

				el.parent.remove(els.next);
				nodes.parent.removeChild(nodes.next);

				// сохраняем ссылки для ctrl+z
				data.mapJoinEqual = data.mapJoinEqual || {};
				data.mapJoinEqual[el.elementId] = data.mapJoinEqual[el.elementId] || [];
				data.mapJoinEqual[el.elementId].push(map);

				// проверяем еще раз
				me.joinEqualSibling(el);
			}

			// проверяем потомков
			el.each(
				function (child)
				{
					me.joinEqualSibling(child);
				}
			);
		},

		/**
		 * @private
		 * Разъединяет соединенные соседние однотипные стилевые элементы.
		 * @param {FBEditor.editor.element.AbstractElement} el Родительский элемент, относительно которого
		 * начинается проверка.
		 */
		unJoinEqualSibling: function (el)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				els = {},
				nodes = {},
				map,
				helper;

			if (el.isStyleFormat && data.mapJoinEqual[el.elementId])
			{
				// разъединяем соединенные соседние элементы

				// получаем сохраненные данные
				map = data.mapJoinEqual[el.elementId][data.mapJoinEqual[el.elementId].length - 1];

				//console.log('el', map.el, map.next, map.child);

				// элемент, который должен быть следующим
				els.old = map.next;
				helper = els.old.getNodeHelper();
				nodes.old = helper.getNode(viewportId);

				helper = el.getNodeHelper();
				nodes.el = helper.getNode(viewportId);

				helper = el.parent.getNodeHelper();
				nodes.parent = helper.getNode(viewportId);

				if (!nodes.old.parentNode)
				{
					// создаем следующий элемент
					//console.log('create next', nodes.old);

					if (els.next = el.next())
					{
						helper = els.next.getNodeHelper();
						nodes.next = helper.getNode(viewportId);

						el.parent.insertBefore(els.old, els.next);
						nodes.parent.insertBefore(nodes.old, nodes.next);
					}
					else
					{
						el.parent.add(els.old);
						nodes.parent.appendChild(nodes.old);
					}
				}

				// переносим потомка во вновь созданный следующий элемент

				els.child = map.child.shift();

				//console.log('child', els.child);

				helper = els.child.getNodeHelper();
				nodes.child = helper.getNode(viewportId);

				els.old.add(els.child);
				nodes.old.appendChild(nodes.child);

				if (!map.child.length)
				{
					// подчищаем данные, как только все потомки перенесены
					data.mapJoinEqual[el.elementId].pop();
				}

				if (!data.mapJoinEqual[el.elementId].length)
				{
					// подчищаем данные
					delete data.mapJoinEqual[el.elementId];
				}

				// проверяем еще раз
				me.unJoinEqualSibling(el);
			}

			// проверяем потомков
			el.each(
				function (child)
				{
					me.unJoinEqualSibling(child);
				}
			);
		},

		/**
		 * @private
		 * Удаляет вложенные друг в друга однотипные стилевые элементы.
		 * @param {FBEditor.editor.element.AbstractElement} el Родительский элемент, относительно которого
		 * начинается проверка.
		 */
		removeEqualInner: function (el)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				els = {},
				nodes = {},
				map,
				helper;

			if (el.isStyleFormat && el.hasParentName(el.getName()))
			{
				// удаляем вложенный элемент, перенося всех его потомков на его же уровень

				// сохраняем ссылки для ctrl+z
				map = {
					el: el,
					child: []
				};

				helper = el.getNodeHelper();
				nodes.el = helper.getNode(viewportId);

				helper = el.parent.getNodeHelper();
				nodes.parent = helper.getNode(viewportId);

				while (els.first = el.first())
				{
					helper = els.first.getNodeHelper();
					nodes.first = helper.getNode(viewportId);

					el.parent.insertBefore(els.first, el);
					nodes.parent.insertBefore(nodes.first, nodes.el);

					// для ctrl+z
					map.child.push(els.first);
				}

				el.parent.remove(el);
				nodes.parent.removeChild(nodes.el);

				// для ctrl+z
				data.mapRemoveEqual = data.mapRemoveEqual || [];
				data.mapRemoveEqual.push(map);
			}

			// проверяем потомков
			el.each(
				function (child)
				{
					me.removeEqualInner(child);
				}
			);
		},

		/**
		 * @private
		 * Восттанваливает удаленные вложенные друг в друга однотипные стилевые элементы.
		 */
		unRemoveEqualInner: function ()
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				els = {},
				nodes = {},
				helper;

			Ext.each(
				data.mapRemoveEqual,
			    function (map)
			    {
				    // восстанавливаем вложенный элемент

				    els.el = map.el;
				    helper = els.el.getNodeHelper();
				    nodes.el = helper.getNode(viewportId);

				    els.parent = els.el.parent;
				    helper = els.parent.getNodeHelper();
				    nodes.parent = helper.getNode(viewportId);

				    els.first = map.child[0];
				    helper = els.first.getNodeHelper();
				    nodes.first = helper.getNode(viewportId);

				    els.parent.insertBefore(els.el, els.first);
				    nodes.parent.insertBefore(nodes.el, nodes.first);

				    // перемещаем во вновь созданный вложенный элемент всех его потомков
				    Ext.each(
					    map.child,
				        function (child)
				        {
					        helper = child.getNodeHelper();
					        nodes.child = helper.getNode(viewportId);

					        els.el.add(child);
					        nodes.el.appendChild(nodes.child);
				        }
				    )
			    }
			)
		}
	}
);