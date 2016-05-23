/**
 * Абстрактная команда удаления элемента-обёртки с сохранением всех его потомков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractDeleteWrapperCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				range;

			try
			{
				manager.suspendEvent = true;

				range = data.range || manager.getRange();
				data.viewportId = range.start.viewportId;

				console.log('del wrapper ' + me.elementName, range);

				nodes.node = range.common;
				els.node = nodes.node.getElement();

				if (range.collapsed)
				{
					// без выделения

					// ищем обёртку
					while (!els.node.hisName(me.elementName))
					{
						nodes.node = nodes.node.parentNode;
						els.node = nodes.node.getElement();

						if (els.node.isRoot)
						{
							return false;
						}
					}

					nodes.parent = nodes.node.parentNode;
					els.parent = nodes.parent.getElement();

					// сохраняем ссылки на первый и последний элементы для undo
					data.first = nodes.node.firstChild;
					data.last = nodes.node.lastChild;

					// переносим всех потомков из обёртки
					nodes.first = nodes.node.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
					while (els.first)
					{
						if (els.node.isLiHolder && !els.first.isLi)
						{
							// удаляем элементы, которые не li
							data.first = nodes.first.nextSibling;
							els.node.remove(els.first);
							nodes.node.removeChild(nodes.first);

							// курсор
							range.start = manager.getDeepFirst(data.first);
							range.end = range.start;
							range.offset.start = 0;
							range.offset.end = 0;
							range.common = range.start;
						}
						else
						{
							els.parent.insertBefore(els.first, els.node);
							nodes.parent.insertBefore(nodes.first, nodes.node);

							if (els.first.isLi)
							{
								// переносим все элементы из li в параграф

								els.p = factory.createElement('p');
								nodes.p = els.p.getNode(data.viewportId);

								els.parent.insertBefore(els.p, els.first);
								nodes.parent.insertBefore(nodes.p, nodes.first);

								if (els.first.elementId === data.first.getElement().elementId)
								{
									// сохраняем ссылку на первый p
									data.first = nodes.p;
								}
								if (els.first.elementId === data.last.getElement().elementId)
								{
									// сохраняем ссылку на последний p
									data.last = nodes.p;
								}

								nodes.firstLi = nodes.first.firstChild;
								els.firstLi = nodes.firstLi ? nodes.firstLi.getElement() : null;
								while (els.firstLi)
								{
									els.p.add(els.firstLi);
									nodes.p.appendChild(nodes.firstLi);
									nodes.firstLi = nodes.first.firstChild;
									els.firstLi = nodes.firstLi ? nodes.firstLi.getElement() : null;
								}

								els.parent.remove(els.first);
								nodes.parent.removeChild(nodes.first);

								els.first = els.p;
								nodes.first = nodes.p;
							}
						}

						nodes.first = nodes.node.firstChild;
						els.first = nodes.first ? nodes.first.getElement() : null;
					}

					// удаляем обёртку
					els.parent.remove(els.node);
					nodes.parent.removeChild(nodes.node);
				}
				else
				{
					throw Error('Выделение в разработке!');
				}

				//console.log('nodes', nodes);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// курсор
				manager.setCursor(
					{
						startNode: range.start,
						startOffset: range.offset.start,
						endNode: range.end,
						endOffset: range.offset.end,
						focusElement: range.common.getElement()
					}
				);

				// сохраняем
				data.range = range;
				data.els = els;
				data.nodes = nodes;

				// проверяем по схеме
				me.verifyElement(els.parent);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
			}

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				nodes = {},
				els = {},
				res = false,
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				range;

			try
			{
				manager.suspendEvent = true;

				range = data.range;
				els = data.els;
				nodes = data.nodes;

				console.log('undo del wrapper ' + me.elementName, data, range);

				if (range.collapsed)
				{
					nodes.first = data.first;
					els.first = nodes.first.getElement();
					nodes.last = data.last;
					els.last = nodes.last.getElement();

					// восстанавливаем обёртку
					nodes.node = els.node.getNode(data.viewportId);
					els.parent.insertBefore(els.node, els.first);
					nodes.parent.insertBefore(nodes.node, nodes.first);

					// перемещаем всех потомков обратно в обёртку

					nodes.next = nodes.first;
					els.next = nodes.next.getElement();
					while (els.next.elementId !== els.last.elementId)
					{
						nodes.buf = nodes.next.nextSibling;
						els.node.add(els.next);
						nodes.node.appendChild(nodes.next);

						if (els.node.isLiHolder)
						{
							// переносим все элементы из параграфа в li

							els.li = factory.createElement('li');
							nodes.li = els.li.getNode(data.viewportId);

							els.node.insertBefore(els.li, els.next);
							nodes.node.insertBefore(nodes.li, nodes.next);

							nodes.firstP = nodes.next.firstChild;
							els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;
							while (els.firstP)
							{
								els.li.add(els.firstP);
								nodes.li.appendChild(nodes.firstP);
								nodes.firstP = nodes.next.firstChild;
								els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;
							}

							els.node.remove(els.next);
							nodes.node.removeChild(nodes.next);
						}

						nodes.next = nodes.buf;
						els.next = nodes.next ? nodes.next.getElement() : null;
					}

					els.node.add(els.last);
					nodes.node.appendChild(nodes.last);

					if (els.node.isLiHolder)
					{
						// переносим все элементы из параграфа в li

						els.li = factory.createElement('li');
						nodes.li = els.li.getNode(data.viewportId);

						els.node.insertBefore(els.li, els.last);
						nodes.node.insertBefore(nodes.li, nodes.last);

						nodes.firstP = nodes.last.firstChild;
						els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;
						while (els.firstP)
						{
							els.li.add(els.firstP);
							nodes.li.appendChild(nodes.firstP);
							nodes.firstP = nodes.last.firstChild;
							els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;
						}

						els.node.remove(els.last);
						nodes.node.removeChild(nodes.last);
					}
				}

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset.start,
					endNode: range.end,
					endOffset: range.offset.end,
					focusElement: range.common.getElement()
				};
				manager.setCursor(data.saveRange);

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