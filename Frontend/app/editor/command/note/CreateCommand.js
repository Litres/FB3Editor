/**
 * Создает note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.note.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',
		
		elementName: 'note',
		
		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				factory = FBEditor.editor.Factory,
				res = false,
				els = {},
				nodes = {},
				viewportId,
				range;
			
			try
			{
				if (manager.isSuspendCmd())
				{
					return false;
				}
				
				range = data.range = manager.getRangeCursor();
				range.offset = range.offset.start;
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();
				
				console.log('create note', range);
				
				viewportId = data.viewportId = range.start.viewportId;
				nodes.start = range.start;
				els.start = nodes.start.getElement();
				data.oldValue = els.start.getText();
				nodes.parent = !els.start.isStyleHolder ? nodes.start.parentNode : nodes.start;
				els.parent = nodes.parent.getElement();
				manager.setSuspendEvent(true);
				
				// новая сноска
				els.node = factory.createElement(me.elementName);
				els.node.createScaffold();
				//nodes.node = els.node.getNode(viewportId);
				
				if (!els.parent.isEmpty())
				{
					// вставляем сноску внутри текста
					
					nodes.next = nodes.start.nextSibling;
					els.next = nodes.next ? nodes.next.getElement() : null;
					
					// получаем части текста
					els.startValue = els.start.getText(0, range.offset);
					els.endValue = els.start.getText(range.offset);
					
					if (els.startValue)
					{
						// меняем текст исходного элемента
						els.start.setText(els.startValue, viewportId);
					}
					else
					{
						// удаляем текст
						els.parent.remove(els.start, viewportId);
					}
				}
				else
				{
					// удаляем пустой элемент
					
					nodes.start = els.start.isStyleHolder ? nodes.start.firstChild : nodes.start;
					els.start = nodes.start.getElement();
					els.parent.remove(els.start, viewportId);
					data.isEmpty = true;
				}
				
				// вставляем сноску
				if (els.next)
				{
					els.parent.insertBefore(els.node, els.next, viewportId);
				}
				else
				{
					els.parent.add(els.node, viewportId);
				}
				
				// новый текстовый элемент c последней частью текста
				if (els.endValue)
				{
					els.t = factory.createElementText(els.endValue);
					//nodes.t = els.t.getNode(data.viewportId);
					
					if (els.next)
					{
						els.parent.insertBefore(els.t, els.next, viewportId);
					}
					else
					{
						els.parent.add(els.t, viewportId);
					}
				}
				
				// синхронизируем элемент
				els.parent.sync(viewportId);
				
				//manager.setChanged(true);
				
				// устанавливаем курсор
				manager.setCursor(
					{
						withoutSyncButtons: true,
						startNode: els.node.first().getNodeHelper().getNode(viewportId),
						startOffset: 1
					}
				);
				
				// сохраняем узел
				data.els = els;
				
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
				nodes = {},
				viewportId,
				manager,
				range;
			
			try
			{
				range = data.range;
				els = data.els;
				viewportId = data.viewportId;
				
				console.log('undo create note', data);
				
				manager = els.node.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);
				
				// удаляем сноску
				els.parent.remove(els.node, viewportId);
				
				nodes.cursor = range.start;
				
				if (data.isEmpty)
				{
					// вставляем пустой
					els.empty = manager.createEmptyElement();
					els.parent.add(els.empty, viewportId);
					nodes.empty = els.empty.getNodeHelper().getNode(viewportId);
					nodes.cursor = nodes.empty;
					//range.start = nodes.empty;
				}
				else
				{
					// возвращаем старый текст
					els.start.setText(data.oldValue, viewportId);
					
					//nodes.next = nodes.start.nextSibling;
					els.next = els.start.next();
					
					if (range.offset < els.start.getLength() && els.next)
					{
						// удаляем новый текстовый узел
						//els.next = nodes.next.getElement();
						els.parent.remove(els.next, viewportId);
					}
				}
				
				els.parent.sync(viewportId);
				
				manager.setChanged(true);
				
				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: range.offset
					}
				);
				
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
		}
	}
);