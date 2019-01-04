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
				factory = FBEditor.editor.Factory,
				res = false,
				nodes = {},
				els = {},
				pos = {},
				offset = {},
				helper,
				viewportId,
				manager,
				range;

			try
			{
				manager = data.opts.manager;
				range = data.range = data.range || manager.getRangeCursor();
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();
				
				viewportId = data.viewportId = range.start.viewportId;

				console.log('del wrapper ' + me.elementName, range);

				nodes.node = range.common;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				manager.setSuspendEvent(true);

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
							els.node.remove(els.first, viewportId);

							// курсор
							range.start = manager.getDeepFirst(data.first);
							range.end = range.start;
							range.offset.start = 0;
							range.offset.end = 0;
							range.common = range.start;
						}
						else
						{
							els.parent.insertBefore(els.first, els.node, viewportId);

							if (els.first.isLi)
							{
								// переносим все элементы из li в параграф

								els.p = factory.createElement('p');
								nodes.p = els.p.getNode(data.viewportId);

								els.parent.insertBefore(els.p, els.first, viewportId);

								if (els.first.equal(data.first.getElement()))
								{
									// сохраняем ссылку на первый p
									data.first = nodes.p;
								}
								if (els.first.equal(data.last.getElement()))
								{
									// сохраняем ссылку на последний p
									data.last = nodes.p;
								}

								nodes.firstLi = nodes.first.firstChild;
								els.firstLi = nodes.firstLi ? nodes.firstLi.getElement() : null;
								while (els.firstLi)
								{
									els.p.add(els.firstLi, viewportId);
									nodes.firstLi = nodes.first.firstChild;
									els.firstLi = nodes.firstLi ? nodes.firstLi.getElement() : null;
								}

								els.parent.remove(els.first, viewportId);

								els.first = els.p;
								nodes.first = nodes.p;
							}
						}

						nodes.first = nodes.node.firstChild;
						els.first = nodes.first ? nodes.first.getElement() : null;
					}

					// удаляем обёртку
					els.parent.remove(els.node, viewportId);
				}
				else
				{
					// снимаем форматирование в выделенном фрагменте

					offset = Ext.clone(range.offset);
					data.links = {};
					els.wrappers = [];

					data.range.oldValue = els.node.getText();
					els.parent = els.node.parent;
					helper = els.parent.getNodeHelper();
					nodes.parent = helper.getNode();
					data.links.parent = nodes.parent;
					els.next = els.parent.next();

					// получаем части текста
					els.startValue = els.node.getText(0, offset.start);
					els.selValue = els.node.getText(offset.start, offset.end);
					els.endValue = els.node.getText(offset.end);

					if (els.node.isText && els.selValue === els.node.getText() && !els.node.prev() && !els.node.next())
					{
						// выделен полностью текстовый узел
						els.wrap = els.node.getParentName(me.elementName);
						els.wrappers.push(els.wrap);
					}
					else
					{
						// получаем все параграфы p (или li/subtitle), которые затрагивает текущее выделение

						// параграфы между первым и последним
						nodes.pp = [];

						// первый параграф
						els.firstP = range.start.getElement();
						els.firstP = els.firstP.getStyleHolder();
						helper = els.firstP.getNodeHelper();
						nodes.firstP = helper.getNode(viewportId);

						// последний параграф
						els.lastP = range.end.getElement().getStyleHolder();
						helper = els.lastP.getNodeHelper();
						nodes.lastP = helper.getNode(viewportId);

						// находим список параграфов между первым и последним
						if (!els.firstP.equal(els.lastP))
						{
							nodes.cur = nodes.firstP;

							while (!nodes.cur.nextSibling)
							{
								nodes.cur = nodes.cur.parentNode;
							}

							nodes.pp = manager.getNodesPP(nodes.cur.nextSibling, nodes, els);

							// ищем обертки в абзацах
							Ext.each(
								nodes.pp,
								function (item)
								{
									var p;

									p = item.getElement();
									els.wrappersPP = Ext.Array.push(els.wrappers, p.getChildrenByName(me.elementName, true));
								}
							);
						}

						// определяем находятся ли граничные точки выделения в начале и конце абзаца
						pos.isStart = els.firstP.isStartRange(range);
						pos.isEnd = els.lastP.isEndRange(range);
						data.range.pos = pos;

						//console.log('pos', pos, nodes);

						if (pos.isStart)
						{
							// начальная точка выделения находится в начале параграфа, разделение узла не требуется
							els.startContainer = els.firstP.first();
							helper = els.startContainer.getNodeHelper();
							nodes.startContainer = helper.getNode(viewportId);
						}
						else
						{
							// разбиваем первый узел на два в точке начального выделения
							nodes.common = nodes.firstP;
							els.common = els.firstP;
							nodes.container = range.start;
							nodes.startContainer = manager.splitNode(els, nodes, offset.start);
							els.startContainer = nodes.startContainer.getElement();
							els.common.removeEmptyText();

							// для курсора необходимо скорректировать начальную точку выделения после разбивки узла
							helper = els.startContainer.getDeepFirst().getNodeHelper();
							range.start = helper.getNode(viewportId);
							range.offset.start = 0;
						}

						nodes.parentStart = nodes.startContainer.parentNode;
						els.parentStart = nodes.parentStart.getElement();

						if (els.node.isText)
						{
							// восстанавливаем корректную ссылку на конечную точку выделения
							range.end = nodes.startContainer.firstChild;
							range.offset.end = offset.end = offset.end - offset.start;
						}

						nodes.endContainer = range.end;
						els.endContainer = nodes.endContainer.getElement();
						nodes.parentEnd = nodes.endContainer.parentNode;
						els.parentEnd = nodes.parentEnd.getElement();

						if (pos.isEnd)
						{
							// конечная точка выделения находится в конце параграфа, разделение узла не требуется
							nodes.endContainer = nodes.lastP.lastChild;
						}
						else if (els.endContainer.isText && els.parentEnd.equal(els.lastP) &&
						         data.range.offset.end === els.endContainer.getLength())
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

							els.parentEnd.remove(nodes.bufRemove.getElement(), viewportId);

							els.endContainer = nodes.endContainer.getElement();
						}

						// ищем обертки в первом абзаце
						els.next = els.startContainer;

						while (els.next && !els.next.equal(els.endContainer))
						{
							els.wrappers = Ext.Array.push(els.wrappers, els.next.getChildrenByName(me.elementName, true));
							els.next = els.next.next();
						}

						// добавляем обертки из абзацев между первым и последним
						els.wrappers = els.wrappersPP ? Ext.Array.push(els.wrappers, els.wrappersPP) : els.wrappers;

						if (!els.firstP.equal(els.lastP) || pos.isEnd)
						{
							// ищем обертки в последнем абзаце

							els.next = pos.isEnd ? els.endContainer : els.lastP.first();

							while (els.next && (!els.next.equal(els.endContainer) || pos.isEnd))
							{
								els.wrappers = Ext.Array.push(els.wrappers, els.next.getChildrenByName(me.elementName, true));
								els.next = els.next.next();
							}
						}
					}

					// удаляем обертки
					Ext.each(
						els.wrappers,
						function (el)
						{
							var children = [];

							el.each(
								function (child)
								{
									children.push(child);
								}
							);

							data.wrappers = data.wrappers || [];

							// сохраняем ссылки на дочерние элементы обертки
							data.wrappers.push(
								{
									el: el,
									children: children
								}
							);

							// перемещаем все дочерние элементы на уровень обертки
							el.upChildren(viewportId);
						}
					);
					
					// корректный родительский элемент для синхронизации
					els.parent = els.parent.parent;
				}

				//console.log('els', els);

				// синхронизируем элемент
				els.parent.sync(viewportId);

				manager.setSuspendEvent(false);

				// курсор
				manager.setCursor(
					{
						withoutSyncButtons: true,
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

			manager.setSuspendEvent(false);
			
			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				nodes = {},
				els = {},
				res = false,
				factory = FBEditor.editor.Factory,
				manager,
				range;

			try
			{
				range = data.range;
				els = data.els;
				nodes = data.nodes;

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				console.log('undo del wrapper ' + me.elementName, data, range);

				if (range.collapsed)
				{
					nodes.first = data.first;
					els.first = nodes.first.getElement();
					nodes.last = data.last;
					els.last = nodes.last.getElement();

					// восстанавливаем обёртку
					nodes.node = els.node.getNode(data.viewportId);
					els.parent.insertBefore(els.node, els.first, viewportId);

					// перемещаем всех потомков обратно в обёртку

					nodes.next = nodes.first;
					els.next = nodes.next.getElement();
					while (els.next.elementId !== els.last.elementId)
					{
						nodes.buf = nodes.next.nextSibling;
						els.node.add(els.next, viewportId);

						if (els.node.isLiHolder)
						{
							// переносим все элементы из параграфа в li

							els.li = factory.createElement('li');
							nodes.li = els.li.getNode(data.viewportId);

							els.node.insertBefore(els.li, els.next, viewportId);
							//nodes.node.insertBefore(nodes.li, nodes.next);

							nodes.firstP = nodes.next.firstChild;
							els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;

							while (els.firstP)
							{
								els.li.add(els.firstP, viewportId);
								//nodes.li.appendChild(nodes.firstP);
								nodes.firstP = nodes.next.firstChild;
								els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;
							}

							els.node.remove(els.next, viewportId);
							//nodes.node.removeChild(nodes.next);
						}

						nodes.next = nodes.buf;
						els.next = nodes.next ? nodes.next.getElement() : null;
					}

					els.node.add(els.last, viewportId);
					//nodes.node.appendChild(nodes.last);

					if (els.node.isLiHolder)
					{
						// переносим все элементы из параграфа в li

						els.li = factory.createElement('li');
						nodes.li = els.li.getNode(data.viewportId);

						els.node.insertBefore(els.li, els.last, viewportId);
						//nodes.node.insertBefore(nodes.li, nodes.last);

						nodes.firstP = nodes.last.firstChild;
						els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;

						while (els.firstP)
						{
							els.li.add(els.firstP, viewportId);
							nodes.firstP = nodes.last.firstChild;
							els.firstP = nodes.firstP ? nodes.firstP.getElement() : null;
						}

						els.node.remove(els.last, viewportId);
					}
				}
				else if (data.wrappers)
				{
					// восстанавливаем обертки
					Ext.each(
						data.wrappers,
						function (item)
						{
							var el = item.el,
								first,
								parent;

							first = item.children[0];
							parent = first.parent;
							parent.insertBefore(el, first, viewportId);

							Ext.each(
								item.children,
							    function (child)
							    {
								    el.add(child, viewportId);
							    }
							);

							me.optimizeEqualIntersectEls(parent);
						}
					);

					delete data.wrappers;
				}
				
				els.parent.sync(viewportId);

				manager.setSuspendEvent(false);

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset.start,
					endNode: range.end,
					endOffset: range.offset.end,
					focusElement: range.common.getElement()
				};
				manager.setCursor(data.saveRange);

				// сохраняем выделение
				data.range = manager.getRange();

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