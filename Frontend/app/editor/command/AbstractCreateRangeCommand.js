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
				manager = FBEditor.getEditorManager(),
				res = false,
				els = {},
				nodes = {},
				offset = {},
				helper,
				viewportId,
				collapsed,
				range,
				joinStartContainer,
				joinEndContainer;

			try
			{
				if (data.saveRange)
				{
					// восстанваливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				range = data.range = manager.getRangeCursor();
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();
				
				viewportId = data.viewportId = range.common.viewportId;
				
				console.log('create range ' + me.elementName, range);

				nodes.common = range.common;
				els.common = nodes.common.getElement();
				manager.setSuspendEvent(true);

				// ищем самый верхниий элемент, который может делиться на несколько
				while (!els.common.splittable)
				{
					nodes.common = nodes.common.parentNode;
					els.common = nodes.common.getElement();

					if (els.common.isRoot)
					{
						return false;
					}
				}

				collapsed = range.collapsed;
				offset = range.offset;

				joinStartContainer = offset.start === 0 ?
				                     !manager.isFirstNode(nodes.common, range.start) : true;

				joinEndContainer = offset.end === range.end.nodeValue.length ?
				                   !manager.isLastNode(nodes.common, range.end) : true;

				range.joinStartContainer = joinStartContainer;
				range.joinEndContainer = joinEndContainer;
				range.prevParentStart = range.start.parentNode.previousSibling;

				//console.log('range', data.range);

				nodes.startContainer = range.start;
				nodes.endContainer = range.end;

				// разбиваем конечный узел текущего выделения
				nodes.container = nodes.endContainer;
				nodes.endContainer = manager.splitNode(els, nodes, offset.end);
				els.endContainer = nodes.endContainer.getElement();

				if (els.endContainer.isEmpty() && !els.common.isEmpty() && nodes.endContainer.previousSibling)
				{
					// удаляем пустой последний контейнер
					//console.log('удален пустой узел после разделения');
					nodes.prev = nodes.endContainer.previousSibling;

					els.common.remove(els.endContainer, viewportId);
					//nodes.common.removeChild(nodes.endContainer);

					nodes.endContainer = nodes.prev;
					nodes.endContainer = joinEndContainer ? nodes.endContainer.previousSibling : nodes.endContainer;
				}

				// начальный узел текущего выделения
				if (collapsed)
				{
					nodes.startContainer = nodes.endContainer;
				}
				else
				{
					// разбиваем начальный узел текущего выделения
					nodes.container = nodes.startContainer;
					nodes.startContainer = manager.splitNode(els, nodes, offset.start);
				}

				//console.log('nodes', nodes, data.range);

				els.startContainer = nodes.startContainer.getElement();
				nodes.endContainer = nodes.endContainer.parentNode ? nodes.endContainer : nodes.startContainer;
				els.endContainer = nodes.endContainer.getElement();

				// создаем новый элемент
				me.createNewElement(els, nodes);

				// синхронизируем
				els.common.sync(viewportId);

				// устанавливаем курсор
				els.cursor = els.node.first();
				helper = els.cursor.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
				manager.setCursor(
					{
						startNode: nodes.cursor
					}
				);

				// сохраянем ссылки
				data.saveNodes = nodes;
				data.els = els;
				data.range = range;

				// проверяем по схеме
				me.verifyElement(els.common);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.common).removeNext();
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
				els = data.els;
				nodes = data.saveNodes;
				viewportId = data.viewportId;

				console.log('undo create range ' + me.elementName, range, nodes);

				els.parent = els.node.parent;

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				// переносим все элементы обратно в исходный контейнер

				els.first = els.node.first();

				while (els.first)
				{
					els.parent.insertBefore(els.first, els.node, viewportId);
					els.first = els.node.first();
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

				// синхронизируем
				els.parent.sync(viewportId);

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
					endOffset: range.offset.end
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
			manager.updateTree();

			return res;
		},

		/**
		 * Создает новый элемент.
		 * @param {Object} els
		 * @param {Object} nodes
		 */
		createNewElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				factory = FBEditor.editor.Factory;

			els.node = factory.createElement(me.elementName);

			// вставляем новый элемент
			els.common.insertBefore(els.node, els.startContainer, viewportId);

			// переносим элементы, которые находятся в текущем выделении в новый элемент

			//nodes.next = nodes.startContainer;
			//els.next = nodes.next.getElement();
			els.next = els.startContainer;

			while (els.next && !els.next.equal(els.endContainer))
			{
				//nodes.buf = nodes.next.nextSibling;
				els.buf = els.next.next();

				els.node.add(els.next, viewportId);

				//nodes.next = nodes.buf;
				//els.next = nodes.next ? nodes.next.getElement() : null;
				els.next = els.buf;
			}

			if (els.next && els.next.equal(els.endContainer) && !data.range.joinEndContainer)
			{
				els.node.add(els.next, viewportId);
			}
		}
	}
);