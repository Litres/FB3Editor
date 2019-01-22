/**
 * Абстрактный класс команды разделения элемента на несколько элементов.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractSplitCommand',
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
				manager = FBEditor.getEditorManager(),
				factory = FBEditor.editor.Factory,
				res = false,
				reg = {},
				pos = {},
				els = {},
				nodes = {},
				offset = {},
				viewportId,
				range,
				joinStartContainer,
				joinEndContainer;

			try
			{
				
				if (data.saveRange)
				{
					// восстанавливаем выделение
					manager.setCursor(data.saveRange);
				}
				
				// получаем данные из выделения
				range = data.range = manager.getRangeCursor();
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();
				
				viewportId = data.viewportId = range.common.viewportId;

				console.log('split', me.elementName, range, data);
				
				if (!data.node)
				{
					// узел, в котором установлен курсор

					nodes.cur = range.start;
					els.cur = nodes.cur.getElement();

					while (els.cur && !els.cur.hisName(me.elementName))
					{
						nodes.cur = nodes.cur.parentNode;
						els.cur = nodes.cur ? nodes.cur.getElement() : null;
					}

					data.node = nodes.cur;
				}

				//console.log('data.node', data.node);
				
				manager.setSuspendEvent(true);
				nodes.prevNode = data.node;
				els.prevNode = nodes.prevNode.getElement();
				offset = range.offset;
				nodes.startContainer = range.start;
				nodes.endContainer = range.end;
				els.startContainer = nodes.startContainer.getElement();
				els.endContainer = nodes.endContainer.getElement();

				// необходимо ли после операции undo соединять узлы
				joinStartContainer = offset.start === 0 ? !manager.isFirstNode(data.node, range.start) : true;

				joinEndContainer = !(els.startContainer.equal(els.endContainer) && range.collapsed);
				joinEndContainer = offset.start === 0 ||
					(range.end.nodeValue && offset.end === range.end.nodeValue.length) ?
					!manager.isLastNode(data.node, range.end) : joinEndContainer;

				range.prevParentStart = range.start.parentNode.previousSibling;
				range.joinStartContainer = joinStartContainer;
				range.joinEndContainer = joinEndContainer;

				//console.log('range', data.range);

				if (!range.collapsed)
				{
					// регулярные выражения для определения позиции выделения
					reg.start = new RegExp('^' + Ext.String.escapeRegex(range.toString()));
					reg.start2 = new RegExp('^' + Ext.String.escapeRegex(els.startContainer.getText()));
					reg.end = new RegExp(Ext.String.escapeRegex(range.toString()) + '$');
					reg.end2 = new RegExp(Ext.String.escapeRegex(els.endContainer.getText()) + '$');

					// находится ли начальная точка выделения в начале первого элемента
					pos.isStart = reg.start.test(els.startContainer.getText()) || reg.start2.test(range.toString());

					// находится ли конечная точка выделения в конце последнего элемента
					pos.isEnd = reg.end.test(els.endContainer.getText()) || reg.end2.test(range.toString());
				}
				else if (!els.startContainer.isBr)
				{
					pos.isEnd = data.range.end.nodeValue && offset.end === data.range.end.nodeValue.length ?
					            manager.isLastNode(data.node, data.range.end) : false;
					pos.isStart = offset.start === 0 ?
					              manager.isFirstNode(data.node, data.range.start) : false;
				}
				else
				{
					pos.isBr = true;
				}

				range.pos = pos;
				
				//console.log('pos', pos, range.toString());

				// разбиваем конечный узел текущего выделения
				nodes.container = nodes.endContainer;
				nodes.common = data.node;
				els.common = data.node.getElement();
				nodes.endContainer = manager.splitNode(els, nodes, offset.end);
				els.endContainer = nodes.endContainer.getElement();
				
				if (els.endContainer.isEmpty() && !els.common.isEmpty() && nodes.endContainer.nextSibling)
				{
					// удаляем пустой последний контейнер
					//console.log('удален пустой узел после разделения');
					nodes.next = nodes.endContainer.nextSibling;

					els.common.remove(els.endContainer, viewportId);

					nodes.endContainer = nodes.next;
					els.endContainer = nodes.endContainer.getElement();
				}

				if (els.endContainer.isEmpty() && !els.common.isEmpty())
				{
					// вставляем пустой элемент
					//console.log('вставлен пустой элемент');
					els.empty = manager.createEmptyElement();
					els.endContainer.add(els.empty, viewportId);
				}

				//console.log('nodes', nodes, els);

				// начальный узел текущего выделения
				if (range.collapsed)
				{
					nodes.startContainer = nodes.endContainer;
				}
				else
				{
					// разбиваем начальный узел текущего выделения
					nodes.container = nodes.startContainer;
					nodes.startContainer = manager.splitNode(els, nodes, offset.start);
				}
				
				els.startContainer = nodes.startContainer.getElement();
				els.endContainer = nodes.endContainer.getElement();

				// создаём элемент
				els.node = factory.createElement(me.elementName);

				// вставляем новый элемент
				nodes.parent = nodes.prevNode.parentNode;
				els.parent = nodes.parent.getElement();
				els.next = els.prevNode.next();
				els.nextPrevNode = els.next;
				nodes.node = els.node.getNode(viewportId);

				if (els.next)
				{
					els.parent.insertBefore(els.node, els.next, viewportId);
				}
				else
				{
					els.parent.add(els.node, viewportId);
				}
				
				// заполняем новый элемент
				me.createElement(nodes, els);

				// переносим элементы, которые находятся после текущего выделения, из старого в новый
				me.moveToCreateElement(nodes, els);
				
				if (data.saveRange)
				{
					//console.log('nodes', nodes, els);return false;
				}
				
				// синхронизируем
				els.parent.sync(viewportId);

				//console.log('nodes', nodes);

				manager.setSuspendEvent(false);

				// устанавливаем курсор
				nodes.cursor = nodes.cursor ? nodes.cursor : nodes.node;
				nodes.cursor = manager.getDeepFirst(nodes.cursor);
				manager.setCursor(
					{
						startNode: nodes.cursor
					}
				);

				// сохраянем ссылки
				data.saveNodes = nodes;
				data.els = els;

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
				els,
				nodes,
				manager,
				range,
				viewportId;

			try
			{
				range = data.range;
				nodes = data.saveNodes;
				els = data.els;
				viewportId = data.viewportId;

				console.log('undo split ' + me.elementName, data);
				
				els.parent = els.node.getParent();
				manager = els.node.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);

				// переносим все элементы обратно

				// если старый элемент пустой, то удаляем из него пустой элемент
				if (els.prevNode.isEmpty())
				{
					els.prevNode.removeAll(viewportId);
				}

				// если новый элемент пустой, то удаляем из него пустой элемент
				if (els.node.isEmpty() && !range.pos.isBr)
				{
					els.node.removeAll(viewportId);
					range.joinStartContainer = false;
				}

				me.restoreElement(nodes, els, range);

				els.first = els.node.first();

				if (els.first)
				{
					me.moveNodes(nodes, els);
				}

				// удаляем новый элемент
				els.parent.remove(els.node, viewportId);

				// объединяем элементы в точках разделения
				if (range.joinStartContainer)
				{
					manager.joinNode(nodes.startContainer);
				}

				if (range.joinEndContainer)
				{
					manager.joinNode(nodes.endContainer);
				}

				if (nodes.empty && els.endContainer.isEmpty())
				{
					// удаляем пустой контейнер
					els.common.remove(els.endContainer, viewportId);
				}

				// синхронизируем
				els.parent.sync(viewportId);

				manager.setSuspendEvent(false);
				
				//console.log('range', range); return false;
				
				// устанавливаем выделение
				if (!range.pos.isStart && !range.pos.isEnd && !range.pos.isBr)
				{
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
						endOffset: range.offset.end
					};
				}
				else
				{
					data.saveRange = {
						startNode: range.pos.isBr || range.pos.isStart ? data.saveNodes.cursor : range.end,
						startOffset: range.offset.start
					};
				}

				manager.setCursor(data.saveRange);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			manager.updateTree();

			return res;
		},

		/**
		 * Перемещает дочерние узлы в другой узел.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 */
		moveNodes: function (nodes, els)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId;
			
			while (els.first)
			{
				els.prevNode.add(els.first, viewportId);
				els.first = els.node.first();
			}
		},

		/**
		 * Восстанавливает элемент до применения команды.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 * @param {Object} range Выделение.
		 */
		restoreElement: function (nodes, els, range)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId;

			if (!range.collapsed)
			{
				//nodes.next = nodes.prevNode.nextSibling;
				els.next = els.prevNode.next();

				els.first = els.next.first();
				me.moveNodes(nodes, els);

				// удаляем новый блок
				els.parent.remove(els.next, viewportId);
			}
		},

		/**
		 * Создаёт содержимое элемента.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 */
		createElement: function (nodes, els)
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory,
				manager,
				viewportId;

			// переносим элементы, которые находятся в текущем выделении, из старого элемента в новый
			if (!data.range.collapsed)
			{
				viewportId = data.viewportId;
				nodes.next = nodes.startContainer;
				els.next = nodes.next ? nodes.next.getElement() : null;
				nodes.parentNext = nodes.next.parentNode;
				els.parentNext = nodes.parentNext.getElement();

				while (els.next && els.next.elementId !== els.endContainer.elementId)
				{
					nodes.buf = nodes.next.nextSibling;

					els.node.add(els.next, viewportId);

					nodes.next = nodes.buf;
					els.next = nodes.next ? nodes.next.getElement() : null;
				}

				// создаем новый блок

				els.node = factory.createElement(me.elementName);

				if (els.nextPrevNode)
				{
					els.parent.insertBefore(els.node, els.nextPrevNode, viewportId);
				}
				else
				{
					els.parent.add(els.node, viewportId);
				}
			}
		},

		/**
		 * Переносит элементы после текущего выделения в новый элемент.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 */
		moveToCreateElement: function (nodes, els)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				manager;
			
			manager = els.node.getManager();
			els.next = els.endContainer;
			els.parentNext = els.next.next() ? els.next.next().getParent() : null;
			
			while (els.next)
			{
				els.buf = els.next.next();
				els.node.add(els.next, viewportId);
				els.next = els.buf;
			}
			
			if (els.parentNext && !els.parentNext.first())
			{
				// добавляем пустой абзац
				els.p = manager.createEmptyP();
				els.parentNext.add(els.p, viewportId);
			}
			
			if (els.prevNode && !els.prevNode.first())
			{
				// добавляем пустой абзац
				els.p = manager.createEmptyP();
				els.prevNode.add(els.p, viewportId);
			}
		}
	}
);