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

				nodes.prevP = nodes.p.previousSibling;
				els.prevP = nodes.prevP ? nodes.prevP.getElement() : null;

				if (!els.prevP || !els.prevP.hisName(me.elementName))
				{
					// отсутствует или не подходит предыдущий узел
					return false;
				}

				console.log('join prev ' + me.elementName, range);

				nodes.lastPrev = nodes.prevP.lastChild;
				els.lastPrev = nodes.lastPrev.getElement();

				nodes.firstP = nodes.p.firstChild;
				els.firstP = nodes.firstP.getElement();

				// курсор
				nodes.cursor = manager.getDeepLast(nodes.lastPrev);
				nodes.startCursor = els.lastPrev.getText() ? els.lastPrev.getText().length : 0;

				data.curEmpty = els.p.isEmpty();

				if (!els.p.isEmpty())
				{
					if (els.prevP.isEmpty())
					{
						// предыдущий пустой

						els.prevP.remove(els.lastPrev);
						nodes.prevP.removeChild(nodes.lastPrev);

						nodes.prevEmpty = true;
					}

					// переносим все элементы из текущего в предыдущий
					nodes.first = nodes.firstP;
					while (nodes.first)
					{
						els.first = nodes.first.getElement();
						els.prevP.add(els.first);
						nodes.prevP.appendChild(nodes.first);
						nodes.first = nodes.p.firstChild;
					}

					// курсор
					nodes.cursor = manager.getDeepFirst(nodes.firstP);
					nodes.startCursor = 0;

					if (els.lastPrev && els.firstP && els.lastPrev.isText && els.firstP.isText)
					{
						// соединяем текстовые узлы

						// сохраняем позицию разделения
						nodes.offset = els.lastPrev.text.length;

						// курсор
						nodes.cursor = nodes.lastPrev;
						nodes.startCursor = nodes.offset;

						manager.joinNode(nodes.firstP);
					}
				}

				// удаляем текущий
				els.parentP.remove(els.p);
				nodes.parentP.removeChild(nodes.p);

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
				me.verifyElement(els.parentP);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removePrev();
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

				console.log('undo join prev ' + me.elementName, nodes, data);

				els.prevP = nodes.prevP.getElement();
				els.parentP = nodes.parentP.getElement();

				// новый элемент
				els.newP = factory.createElement(me.elementName);
				nodes.newP = els.newP.getNode(data.viewportId);

				// вставляем
				nodes.nextP = nodes.prevP.nextSibling;
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

				if (data.curEmpty)
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
						els.common = els.prevP;
						nodes.container = nodes.cursor;
						nodes.firstP = manager.splitNode(els, nodes, nodes.offset);
					}

					// переносим элементы в новый
					nodes.next = nodes.firstP;
					while (nodes.next)
					{
						nodes.buf = nodes.next.nextSibling;
						els.next = nodes.next.getElement();
						els.newP.add(els.next);
						nodes.newP.appendChild(nodes.next);
						nodes.next = nodes.buf;
					}

					if (els.prevP.isEmpty())
					{
						// создаем пустой элемент
						els.empty = manager.createEmptyElement();
						nodes.empty = els.empty.getNode(data.viewportId);

						els.prevP.add(els.empty);
						nodes.prevP.appendChild(nodes.empty);
					}

				}

				els.parentP.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				nodes.cursor = manager.getDeepFirst(nodes.newP);
				data.saveRange = {
					startNode: nodes.cursor
				};
				manager.setCursor(data.saveRange);

				data.nodes = nodes;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			return res;
		}
	}
);