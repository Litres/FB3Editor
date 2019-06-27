/**
 * Сдвигает секцию влево (уменьшает вложеность).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.section.JoinCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',
		
		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				res = false,
				els = {},
				node,
				factory,
				viewportId,
				range;
			
			try
			{
				if (manager.isSuspendCmd())
				{
					return false;
				}
				
				// получаем данные из выделения
				range = manager.getRangeCursor();
				
				console.log('section join prev', range);
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();
				
				node = range.common;
				viewportId = data.viewportId = node.viewportId;
				els.node = node.getElement();
				factory = manager.getFactory();
				els.focus = manager.getFocusElement();
				manager.setSuspendEvent(true);
				
				// текущая секция
				els.section = els.focus.isSection ? els.focus : els.focus.getParentName('section');
				
				// курсор
				els.cursor = els.section.getDeepFirst();
				
				// предыдущая секция
				els.sectionPrev = els.section.prev();
				
				if (!els.sectionPrev)
				{
					return false;
				}
				
				// родительский элемент секции
				els.parent = els.section.getParent();
				
				// есть ли вложенные секции в текущей
				els.hasInnerSection = els.section.last().isSection;

				// есть ли вложенные секции в предыдущей
				els.hasInnerSectionPrev = els.sectionPrev.last().isSection;
				
				// самая последняя вложенная секция в предыдущей секции
				els.lastInnerSectionPrev = els.hasInnerSectionPrev ?
					els.sectionPrev.last().getDeepLast().getParentName('section') : null;
				
				if (els.hasInnerSection && !els.lastInnerSectionPrev)
				{
					me.joinInnerSection(els);
				}
				else
				{
					// переносим все элементы из текущей секции в предыдущую
					
					els.first = els.firstEl = els.section.first();
					
					while (els.first)
					{
						if (els.first.isTitle || els.first.isAnnotation || els.first.isEpigraph)
						{
							// преобразуем title, annotation, epigraph в blockquote
							
							els.links = els.links || [];
							els.bq = factory.createElement('blockquote');
							els.links.push(
								{
									src: els.first,
									dest: els.bq
								}
							);
							
							if (els.lastInnerSectionPrev)
							{
								// добавляем элементы в последнюю вложенную секцию из предыдущей секции
								els.lastInnerSectionPrev.add(els.bq, viewportId);
							}
							else
							{
								// добавляем элементы в предыдущую секцию
								els.sectionPrev.add(els.bq, viewportId);
							}
							
							while (els.first.first())
							{
								els.bq.add(els.first.first(), viewportId);
							}
							
							els.section.remove(els.first, viewportId);
						}
						else
						{
							if (els.lastInnerSectionPrev && !els.hasInnerSection)
							{
								// добавляем элементы в последнюю вложенную секцию из предыдущей секции
								els.lastInnerSectionPrev.add(els.first, viewportId);
							}
							else
							{
								els.sectionPrev.add(els.first, viewportId);
							}
						}
						
						els.first = els.section.first();
					}
					
					// удаляем текущую секцию
					els.parent.remove(els.section, viewportId);
				}
				
				// сохраняем ссылки на элементы
				data.els = els;
				
				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: els.cursor.getNodeHelper().getNode()
					}
				);
				
				// синхронизируем элемент
				els.parent.sync(viewportId);
				
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
				manager,
				viewportId;
			
			try
			{
				viewportId = data.viewportId;
				els = data.els;
				manager = els.focus.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);
				
				if (els.hasInnerSection && !els.lastInnerSectionPrev)
				{
					me.unJoinInnerSection(els);
				}
				else
				{
					// восстанавливаем удаленную секцию
					if (els.sectionPrev.next())
					{
						els.parent.insertBefore(els.section, els.sectionPrev.next(), viewportId);
					}
					else
					{
						els.parent.add(els.section, viewportId);
					}
					
					// возвращаем элементы в секцию
					
					if (els.links)
					{
						Ext.each(
							els.links,
							function (item)
							{
								els.section.add(item.src, viewportId);
								
								while (item.dest.first())
								{
									item.src.add(item.dest.first(), viewportId);
								}
								
								els.next = item.dest.next();
								
								if (els.lastInnerSectionPrev)
								{
									els.lastInnerSectionPrev.remove(item.dest, viewportId);
								}
								else
								{
									els.sectionPrev.remove(item.dest, viewportId);
								}
							}
						);
					}
					else
					{
						els.next = els.firstEl;
					}
					
					while (els.next)
					{
						els.buf = els.next.next();
						els.section.add(els.next, viewportId);
						els.next = els.buf;
					}
				}
				
				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: els.cursor.getNodeHelper().getNode()
					}
				);
				
				// синхронизируем элемент
				els.parent.sync(viewportId);
				
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
		
		/**
		 * @private
		 * Объединяет текущую секцию, в которой есть вложенная секция, с предыдущей, в которой нет вложенных секций.
		 * Объединение происходит за счет переноса всего текста из предыдущей секции в первую самую вложенную секцию
		 * текущей секции.
		 * @param {Object} els Элементы.
		 */
		joinInnerSection: function (els)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				manager = FBEditor.getEditorManager(),
				factory = manager.getFactory();
			
			// ищем самую первую вложенную секция в текущей секции
			els.firstInnerSection = me.getFirstInnerSection(els.section);

			// элемент текущей секции, перед которым будут вставляться все элементы из предыдущей
			els.next = els.firstInnerSection.first();
			
			// сохраняем ссылку на последний элемент из предыдущей секции
			els.lastEl = els.sectionPrev.last();
			
			// переносим все элементы из предыдущей секции в текущую

			els.first = els.sectionPrev.first();
			
			while (els.first)
			{
				els.firstInnerSection.insertBefore(els.first, els.next, viewportId);
				els.first = els.sectionPrev.first();
			}
			
			// удаляем предыдущую секцию
			els.parent.remove(els.sectionPrev, viewportId);
			
			// преобразуем title, annotation, epigraph в blockquote
			
			els.first = els.next;
			
			while (els.first.isTitle || els.first.isAnnotation || els.first.isEpigraph)
			{
				els.links = els.links || [];
				els.bq = factory.createElement('blockquote');
				els.links.push(
					{
						src: els.first,
						dest: els.bq
					}
				);
				
				els.firstInnerSection.insertBefore(els.bq, els.first, viewportId);
				
				while (els.first.first())
				{
					els.bq.add(els.first.first(), viewportId);
				}
				
				els.buf = els.first.next();
				els.firstInnerSection.remove(els.first, viewportId);
				els.first = els.buf;
			}
		},
		
		/**
		 * @private
		 * Разъединяет секции, объединенные методом #joinInnerSection.
		 * @param {Object} els Элементы.
		 */
		unJoinInnerSection: function (els)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId;
			
			// восстанавливаем удаленную секцию
			els.parent.insertBefore(els.sectionPrev, els.section, viewportId);
			
			// возвращаем элементы в секцию
			
			els.next = els.firstInnerSection.first();
			
			while (true)
			{
				els.buf = els.next.next();
				els.sectionPrev.add(els.next, viewportId);
				
				if (els.next.equal(els.lastEl))
				{
					break;
				}
				
				els.next = els.buf;
			}
			
			if (els.links)
			{
				// преобразуем элементы обратно
				
				els.next = els.firstInnerSection.first();
				
				Ext.each(
					els.links,
					function (item)
					{
						els.firstInnerSection.insertBefore(item.src, els.next, viewportId);
						
						while (item.dest.first())
						{
							item.src.add(item.dest.first(), viewportId);
						}
						
						els.next = item.dest.next();
						
						els.firstInnerSection.remove(item.dest, viewportId);
					}
				);
			}
		},
		
		/**
		 * @private
		 * Возвращает первую самую вложенную секцию относительно текущей.
		 * @param {FBEditor.editor.element.section.SectionElement} section Текущая секция.
		 * @return {FBEditor.editor.element.section.SectionElement}
		 */
		getFirstInnerSection: function (section)
		{
			var me = this,
				els = {};
			
			els.firstInnerSection = section.first();
			
			while (!els.firstInnerSection.isSection)
			{
				els.firstInnerSection = els.firstInnerSection.next();
			}
			
			// есть ли еще вложенные секции
			els.hasInnerSection = els.firstInnerSection.last().isSection;
			
			if (els.hasInnerSection)
			{
				// продолжаем поиск первой самой вложенной секции
				els.firstInnerSection = me.getFirstInnerSection(els.firstInnerSection);
			}
			
			return els.firstInnerSection;
		}
	}
);