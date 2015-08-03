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

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				sel = window.getSelection(),
				manager = FBEditor.editor.Manager,
				range;

			try
			{
				manager.suspendEvent = true;

				// получаем данные из выделения
				range = sel.getRangeAt(0);

				data.viewportId = range.commonAncestorContainer.viewportId;

				nodes.p = range.commonAncestorContainer;
				els.p = nodes.p.getElement();

				// ищем самый верхний контейнер
				while (!els.p.hisName(me.elementName))
				{
					nodes.p = nodes.p.parentNode;
					els.p = nodes.p.getElement();
				}

				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();

				nodes.nextP = nodes.p.nextSibling;
				els.nextP = nodes.nextP ? nodes.nextP.getElement() : null;

				if (!els.nextP || !els.nextP.hisName(me.elementName))
				{
					// отсутствует или не подходит следующий узел
					return false;
				}

				console.log('join next ' + me.elementName, range);

				nodes.firstNext = nodes.nextP.firstChild;
				els.firstNext = nodes.firstNext.getElement();

				nodes.last = nodes.p.lastChild;
				els.last = nodes.last.getElement();

				// курсор
				nodes.cursor = nodes.firstNext;
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
					// текущий пустой

					// удаляем пустой
					els.p.remove(els.last);
					nodes.p.removeChild(nodes.last);

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
					nodes.first = nodes.firstNext;
					while (nodes.first)
					{
						els.first = nodes.first.getElement();
						els.p.add(els.first);
						nodes.p.appendChild(nodes.first);
						nodes.first = nodes.nextP.firstChild;
					}

					if (els.firstNext && els.last && els.firstNext.isText && els.last.isText)
					{
						// соединяем текстовые узлы

						// сохраняем позицию разделения
						nodes.offset = els.last.text.length;

						// курсор
						nodes.cursor = nodes.last;
						nodes.startCursor = nodes.offset;

						manager.joinNode(nodes.firstNext);
					}
				}

				// удаляем следующий
				els.parentP.remove(els.nextP);
				nodes.parentP.removeChild(nodes.nextP);

				//console.log('nodes, els', nodes, els);

				els.parentP.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: nodes.startCursor
					}
				);

				// сохраняем ссылки
				data.nodes = nodes;

				// проверяем по схеме
				me.verifyElement(els.parent);

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
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory;

			try
			{
				manager.suspendEvent = true;

				// исходные данные
				nodes = data.nodes;

				console.log('undo join next ' + me.elementName, nodes, els);

				els.p = nodes.p.getElement();
				els.parentP = nodes.parentP.getElement();

				// новый элемент
				els.newP = factory.createElement(me.elementName);
				nodes.newP = els.newP.getNode(data.viewportId);

				// вставляем
				nodes.nextP = nodes.p.nextSibling;
				els.nextP = nodes.nextP ? nodes.nextP.getElement() : null;
				if (els.nextP)
				{
					els.parentP.insertBefore(els.newP, els.nextP);
					nodes.parentP.insertBefore(nodes.newP, nodes.nextP);
				}
				else
				{
					els.parentP.add(els.newP);
					nodes.parentP.appendChild(nodes.newP);
				}

				if (nodes.bothEmpty || nodes.nextEmpty)
				{
					// создаем пустой элемент
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(data.viewportId);

					els.newP.add(els.empty);
					nodes.newP.appendChild(nodes.empty);
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
					nodes.next = nodes.cursor;
					while (nodes.next)
					{
						nodes.buf = nodes.next.nextSibling;
						els.next = nodes.next.getElement();
						els.newP.add(els.next);
						nodes.newP.appendChild(nodes.next);
						nodes.next = nodes.buf;
					}

					if (els.p.isEmpty())
					{
						// создаем пустой элемент
						els.empty = manager.createEmptyElement();
						nodes.empty = els.empty.getNode(data.viewportId);

						els.p.add(els.empty);
						nodes.p.appendChild(nodes.empty);
					}

				}

				els.parentP.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				nodes.cursor = manager.getDeepLast(nodes.p);
				nodes.startCursor = nodes.cursor.getElement().getText().length;
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: nodes.startCursor
				};
				manager.setCursor(data.saveRange);

				data.nodes = nodes;

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