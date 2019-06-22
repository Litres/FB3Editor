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
						
						els.sectionPrev.add(els.bq, viewportId);
						
						while (els.first.first())
						{
							els.bq.add(els.first.first(), viewportId);
						}
						
						els.section.remove(els.first, viewportId);
					}
					else
					{
						els.sectionPrev.add(els.first, viewportId);
					}
					
					els.first = els.section.first();
				}
				
				// удаляем текущую секцию
				els.parent.remove(els.section, viewportId);
				
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
							
							els.sectionPrev.remove(item.dest, viewportId);
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
				me.getHistory(els.sectionParent).removeNext();
			}
			
			manager.setSuspendEvent(false);
			
			return res;
		}
	}
);