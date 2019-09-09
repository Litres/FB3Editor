/**
 * Создает секцию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.section.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		syncButtons: false,
		elementName: 'section',

		createElement: function (els, nodes)
		{
			var me = this,
				elementName = me.elementName,
				data = me.getData(),
				factory = FBEditor.editor.Factory,
				viewportId = data.viewportId,
				range = data.range,
				helper,
				manager,
				inner;
			
			manager = els.node.getManager();
			
			// вложенная ли секция
			inner = data.opts && data.opts.inner;
			
			els.parent = els.node.getParent();
			els.next = els.node.next();
			
			if (inner)
			{
				// вложенная секция
				
				// ищем родительскую секцию или корневой элемент
				els.parent = els.node.isSection ? els.node : (els.node.getParentName('section') || els.node.getRoot());
				
				// создаем секцию
				els.node = els.section = factory.createElement(elementName);
				
				if (range.collapsed)
				{
					// создаем заголовок для вложенной секции
					// заголовок по умолчанию
					els.inner = {};
					els.inner.p = factory.createElement('p');
					els.inner.t = factory.createElementText('Вложенная глава');
					els.inner.p.add(els.inner.t);
					els.inner.title = factory.createElement('title');
					els.inner.title.add(els.inner.p);
					els.section.add(els.inner.title);
				}
				
				// вставляем новую секцию внутрь текущей
				els.parent.add(els.section, viewportId);
				
				// переносим все дочерние элементы в новую секцию, кроме title, epigraph, annotation
				
				els.except = ['title', 'epigraph', 'annotation'];
				els.next = els.parent.first();
				
				while (els.next && !els.next.equal(els.section))
				{
					els.buf = els.next.next();
					
					if (!Ext.Array.contains(els.except, els.next.getName()))
					{
						els.section.add(els.next, viewportId);
					}
					
					els.next = els.buf;
				}
				
				if (!range.collapsed)
				{
					// первый выделенный абзац
					els.firstP = range.start.getElement();
					els.firstP = els.firstP.isStyleHolder ? els.firstP : els.firstP.getStyleHolder();
					
					// последний выделенный абзац
					els.lastP = range.end.getElement();
					els.lastP = els.lastP.isStyleHolder ? els.lastP : els.lastP.getStyleHolder();
					
					// создаем вторую вложенную секцию
					els.section2 = factory.createElement(elementName);
					
					// создаем заголовок для второй вложенной секции
					els.title2 = factory.createElement('title');
					els.section2.add(els.title2);
					
					// вставляем вторую секцию внутрь текущей
					els.parent.add(els.section2, viewportId);
					
					// ищем элемент, с которого начнется перенос во вторую вложенную секцию
					
					els.next2 = range.end.getElement();
					
					while (!els.next2.getParent().equal(els.section))
					{
						els.next2 = els.next2.getParent();
					}
					
					els.next2 = els.next2.next();
					
					// переносим выделенные абзацы в заголовок
					
					helper = els.firstP.getNodeHelper();
					nodes.firstP = helper.getNode(viewportId);
					helper = els.lastP.getNodeHelper();
					nodes.lastP = helper.getNode(viewportId);
					els.common = els.section;
					
					// получаем все выделенные абзацы
					nodes.pp = manager.getNodesPP(nodes.firstP, nodes, els);
					nodes.pp.push(nodes.lastP);
					
					// переносим все выделенные абзацы в заголовок
					Ext.each(
						nodes.pp,
						function (p)
						{
							var elP = p.getElement(),
								elParent = elP.getParent(),
								elEmpty = {
									el: null,
									elParent: null,
									next: null
								};
							
							// временно сохраняем ссылки для использования в операции undo
							elP._oldLinks = {
								parent: elParent,
								next: elP.next(),
								empty: null
							};
							
							// переносим абзац в заголовок
							els.title2.add(elP, viewportId);
							
							if (elParent.isEmpty())
							{
								// удаляем пустой родительский элемент, образовавшийся после переноса абзаца
								
								elEmpty.el = elParent;
								elEmpty.elParent = elEmpty.el.getParent();
								
								while (elEmpty.elParent.isEmpty())
								{
									elEmpty.el = elEmpty.elParent;
									elEmpty.elParent = elEmpty.elParent.getParent();
								}
								
								elEmpty.next = elEmpty.el.next();
								
								elEmpty.elParent.remove(elEmpty.el, viewportId);
								
								// сохраняем ссылку на удаленный элемент
								elP._oldLinks.empty = elEmpty;
							}
						}
					);
					
					// переносим все элементы, находящиеся после выделения, во вторую секцию
					
					while (els.next2)
					{
						els.buf = els.next2.next();
						els.section2.add(els.next2, viewportId);
						els.next2 = els.buf;
					}
					
					// для курсора
					els.p = els.lastP;
					
					if (els.section2.last().isTitle)
					{
						// добавляем пустой абзац после заголовка, если других элементов после него нет,
						// чтобы соответствовать схеме
						els.emptyP = manager.createEmptyP();
						els.section2.add(els.emptyP, viewportId);
					}
					
					if (els.section.isEmpty())
					{
						// если в первой вложенной секции нет элементов
						// удаляем ее
						els.parent.remove(els.section, viewportId);
					}
				}
			}
			else
			{
				// добавляем секцию

				els.node = factory.createElement(elementName);
				els = Ext.apply(els, els.node.createScaffold());
				
				// следующая ли секция
				//next = data.opts && data.opts.inner;
				
				if (els.next)
				{
					els.parent.insertBefore(els.node, els.next, viewportId);
				}
				else
				{
					els.parent.add(els.node, viewportId);
				}
			}
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els,
				nodes,
				viewportId,
				manager,
				range,
				inner;

			try
			{
				console.log('undo create section', data);
				
				// вложенная ли секция
				inner = data.opts && data.opts.inner;
				
				viewportId = data.viewportId;
				els = data.els;
				range = data.range;
				nodes = data.nodes;
				manager = els.node.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);
				els.parent = els.node.getParent();

				if (inner)
				{
					if (els.section.isEmpty())
					{
						// восстанвадваем первую вложенную секцию, чтобы восстановить абзацы в ней из второй секции
						els.parent.add(els.section, viewportId);
					}
					
					if (els.section2)
					{
						if (els.emptyP)
						{
							// удаляем пустой абзац
							els.section2.remove(els.emptyP, viewportId);
						}
						
						// переносим все элементы из второй вложенной секции обратно в первую
						
						els.first = els.title2.next();
						
						while (els.first)
						{
							els.section.add(els.first, viewportId);
							els.first = els.title2.next();
						}
						
						// возвращаем абзацы на старое место
						
						// переворачиваем массив, чтобы восстанавливались корректные связи между сиблингами
						nodes.pp = nodes.pp.reverse();
						
						Ext.each(
							nodes.pp,
							function (p)
							{
								var elP = p.getElement(),
									oldLinks = elP._oldLinks,
									empty = oldLinks.empty;
								
								if (empty)
								{
									// восстанавливаем родительский элемент абзаца, если он оказался пустым и был удален
									
									if (empty.next)
									{
										empty.elParent.insertBefore(empty.el, empty.next, viewportId);
									}
									else
									{
										empty.elParent.add(empty.el, viewportId);
									}
								}
								
								if (oldLinks.next)
								{
									oldLinks.parent.insertBefore(elP, oldLinks.next, viewportId);
								}
								else
								{
									oldLinks.parent.add(elP, viewportId);
								}
								
								elP._oldLinks = null;
							}
						);
						
						// удаляем вторую секцию
						els.parent.remove(els.section2, viewportId);
					}

					// переносим все элементы из первой вложенной секции обратно в родительскую
					
					if (els.inner)
					{
						// удаляем заголовок вложенной секции
						els.node.remove(els.inner.title, viewportId);
					}
					
					els.first = els.section.first();
					
					while (els.first)
					{
						els.parent.insertBefore(els.first, els.section, viewportId);
						els.first = els.node.first();
					}
					
					// удаляем первую секцию
					els.parent.remove(els.section, viewportId);

					// устанавливаем курсор
					me.setCursor();
				}
				else
				{
					// удаляем секцию
					els.parent.remove(els.node, viewportId);

					// устанавливаем курсор
					range = data.range;
					data.saveRange = {
						startNode: range.start,
						startOffset: range.offset.start,
						focusElement: els.parent
					};
					manager.setCursor(data.saveRange);
				}

				els.parent.sync(viewportId);

				manager.setSuspendEvent(false);

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

		setCursor: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				range,
				focusEl,
				inner,
				manager;

			inner = data.opts && data.opts.inner;

			if (!inner)
			{
				nodes.p = els.p.nodes[data.viewportId];
				data.saveRange = {
					startNode: nodes.p.firstChild,
					startOffset: nodes.p.firstChild.length,
					focusElement: els.p
				};
			}
			else
			{
				range = data.range;
				focusEl = range.start.getElement().getStyleHolder();
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset.start,
					endNode: range.collapsed ? null : range.end,
					endOffset: range.collapsed ? null : range.offset.end,
					focusElement: focusEl
				};
			}

			manager = data.saveRange.focusElement.getManager();
			manager.setCursor(data.saveRange);
		}
	}
);