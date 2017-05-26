/**
 * Соединяет элемент со следующим.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.styleholder.AbstractJoinNextNodeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		elementName: null,
		syncButtons: false,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				sel = window.getSelection(),
				helper,
				viewportId,
				manager,
				range;

			try
			{
				// получаем данные из выделения
				range = sel.getRangeAt(0);

				viewportId = data.viewportId = range.commonAncestorContainer.viewportId;

				nodes.p = range.commonAncestorContainer;
				els.p = nodes.p.getElement();

				manager = els.p.getManager();
				manager.setSuspendEvent(true);

				// ищем самый верхний контейнер
				while (!els.p.hisName(me.elementName))
				{
					nodes.p = nodes.p.parentNode;
					els.p = nodes.p.getElement();
				}

				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();

				els.nextP = els.p.next();

				if (!els.nextP || !els.nextP.hisName(me.elementName))
				{
					// отсутствует или не подходит следующий абзац
					return false;
				}

				console.log('join next ' + me.elementName, range, els);

				els.firstNext = els.nextP.first();
				els.last = els.p.last();

				// курсор
				helper = els.firstNext.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
				nodes.startCursor = 0;

				if (els.p.isEmpty() && els.nextP.isEmpty())
				{
					// оба пустые

					nodes.cursor = range.commonAncestorContainer;
					nodes.startCursor = 0;

					nodes.bothEmpty = true;
				}
				else if (els.p.isEmpty())
				{
					// удаляем пустой
					els.p.remove(els.last, viewportId);
					nodes.curEmpty = true;
				}
				else if (els.nextP.isEmpty())
				{
					// следующий пустой

					nodes.cursor = manager.getDeepLast(nodes.p);
					nodes.startCursor = nodes.cursor.nodeValue ? nodes.cursor.nodeValue.length : 0;
					nodes.nextEmpty = true;
				}

				if (!els.nextP.isEmpty())
				{
					// переносим все элементы из следующего в текущий

					els.first = els.firstNext;

					while (els.first)
					{
						els.p.add(els.first, viewportId);
						els.first = els.nextP.first();
					}

					if (els.firstNext && els.last && els.firstNext.isText && els.last.isText)
					{
						// соединяем текстовые узлы

						// сохраняем позицию разделения
						nodes.offset = els.last.text.length;

						// курсор
						helper = els.last.getNodeHelper();
						nodes.cursor = helper.getNode(viewportId);
						nodes.startCursor = nodes.offset;

						helper = els.firstNext.getNodeHelper();
						nodes.firstNext = helper.getNode(viewportId);
						manager.joinNode(nodes.firstNext);
					}
				}

				// удаляем следующий абзац и синхронизируем
				els.parentP.remove(els.nextP, viewportId);
				els.parentP.sync(viewportId);

				//console.log('nodes, els', nodes, els);

				// устанавливаем курсор
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
				helper,
				viewportId,
				els,
				nodes,
				manager;

			try
			{
				// исходные данные
				nodes = data.nodes;
				els = data.els;

				console.log('undo join next ' + me.elementName, nodes, els);

				viewportId = data.viewportId;
				manager = els.p.getManager();
				manager.setSuspendEvent(true);

				// ссылка на старый абзац
				els.newP = els.nextP;

				// воссоздаем следующий абзац

				els.next = els.p.next();

				if (els.next)
				{
					els.parentP.insertBefore(els.newP, els.next, viewportId);
				}
				else
				{
					els.parentP.add(els.newP, viewportId);
				}

				if (nodes.bothEmpty || nodes.nextEmpty)
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
						els.common = els.p;
						nodes.container = nodes.cursor;
						nodes.cursor = manager.splitNode(els, nodes, nodes.offset);
					}

					// переносим элементы в новый

					//nodes.next = nodes.cursor;
					els.next = nodes.cursor.getElement();

					while (els.next)
					{
						els.buf = els.next.next();
						els.newP.add(els.next, viewportId);
						els.next = els.buf;
					}

					if (els.p.isEmpty())
					{
						// создаем пустой элемент
						els.empty = manager.createEmptyElement();
						nodes.empty = els.empty.getNode(viewportId);
						els.p.add(els.empty, viewportId);
					}

				}

				els.parentP.sync(viewportId);

				// устанавливаем курсор
				helper = els.p.getNodeHelper();
				nodes.p = helper.getNode(viewportId);
				nodes.cursor = manager.getDeepLast(nodes.p);
				nodes.startCursor = nodes.cursor.getElement().getText().length;
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: nodes.startCursor
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
		}
	}
);