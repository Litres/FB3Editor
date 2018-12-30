/**
 * Соединяет элемент с предыдущим.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.styleholder.AbstractJoinPrevNodeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		elementName: null,
		syncButtons: false,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				res = false,
				els = {},
				nodes = {},
				viewportId,
				helper,
				range;

			try
			{
				// получаем данные из выделения
				range = data.range = manager.getRangeCursor();
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();

				viewportId = data.viewportId = range.common.viewportId;
				nodes.p = range.common;
				els.p = nodes.p.getElement();
				manager = els.p.getManager();
				manager.setSuspendEvent(true);

				// ищем самый верхний контейнер
				els.p = els.p.hisName(me.elementName) ? els.p : els.p.getParentName(me.elementName);
				els.parentP = els.p.parent;
				els.prevP = els.p.prev();

				if (!els.prevP || !els.prevP.hisName(me.elementName))
				{
					// отсутствует или не подходит предыдущий узел
					return false;
				}

				console.log('join prev ' + me.elementName, range);

				els.lastPrev = els.prevP.last();
				els.firstP = els.p.first();

				// курсор
				els.cursor = els.lastPrev.getDeepLast();
				nodes.startCursor = els.lastPrev.getText() ? els.lastPrev.getLength() : 0;

				// пустой ли элемент
				data.curEmpty = els.p.isEmpty();

				if (!data.curEmpty)
				{
					if (els.prevP.isEmpty())
					{
						// предыдущий пустой
						els.prevP.remove(els.lastPrev, viewportId);
						nodes.prevEmpty = true;
					}

					// переносим все элементы из текущего в предыдущий
					while (els.first = els.p.first())
					{
						els.prevP.add(els.first, viewportId);
					}

					// курсор
					els.cursor = els.firstP.getDeepFirst();
					nodes.startCursor = 0;

					if (els.lastPrev && els.firstP && els.lastPrev.isText && els.firstP.isText)
					{
						// соединяем текстовые узлы

						// сохраняем позицию разделения
						nodes.offset = els.lastPrev.getLength();

						// курсор
						els.cursor = els.lastPrev;
						nodes.startCursor = nodes.offset;

						helper = els.firstP.getNodeHelper();
						nodes.firstP = helper.getNode(viewportId);
						manager.joinNode(nodes.firstP);
					}
				}

				// удаляем текущий
				els.parentP.remove(els.p, viewportId);

				els.parentP.sync(viewportId);

				// устанавливаем курсор
				helper = els.cursor.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
				manager.setCursor(
					{
						withoutSyncButtons: true,
						startNode: nodes.cursor,
						startOffset: nodes.startCursor
					}
				);

				// сохраняем ссылки
				data.nodes = nodes;
				data.els = els;

				// проверяем по схеме
				me.verifyElement(els.parentP);

				// скроллим окно вверх, если курсора не видно
				manager.scrollViewUp();

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parentP).removePrev();
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
				viewportId = data.viewportId,
				helper,
				manager;

			try
			{
				// исходные данные
				nodes = data.nodes;
				els = data.els;

				console.log('undo join prev ' + me.elementName, nodes, data);

				manager = els.parentP.getManager();
				manager.setSuspendEvent(true);

				// новый элемент
				els.newP = factory.createElement(me.elementName);
				nodes.newP = els.newP.getNode(viewportId);

				// вставляем
				if (els.nextP = els.prevP.next())
				{
					els.parentP.insertBefore(els.newP, els.nextP, viewportId);
				}
				else
				{
					els.parentP.add(els.newP, viewportId);
				}

				if (data.curEmpty)
				{
					// создаем пустой элемент
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(viewportId);
					els.newP.add(els.empty, viewportId);
				}
				else
				{
					if (nodes.offset)
					{
						// разбиваем узел
						els.common = els.prevP;
						nodes.container = nodes.cursor;
						nodes.firstP = manager.splitNode(els, nodes, nodes.offset);
						els.firstP = nodes.firstP.getElement();
					}

					// переносим элементы в новый

					els.next = els.firstP;

					while (els.next)
					{
						els.buf = els.next.next();
						els.newP.add(els.next, viewportId);
						els.next = els.buf;
					}

					if (els.prevP.isEmpty())
					{
						// создаем пустой элемент
						els.empty = manager.createEmptyElement();
						nodes.empty = els.empty.getNode(viewportId);
						els.prevP.add(els.empty, viewportId);
					}

				}

				els.parentP.sync(viewportId);

				// устанавливаем курсор
				els.cursor = els.newP.getDeepFirst();
				helper = els.cursor.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
				data.saveRange = {
					startNode: nodes.cursor
				};
				manager.setCursor(data.saveRange);

				data.nodes = nodes;
				data.els = els;

				// скроллим окно вниз, если курсора не видно
				manager.scrollViewDown();

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parentP).remove();
			}

			manager.setSuspendEvent(false);

			return res;
		}
	}
);