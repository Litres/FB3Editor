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
				
				// тело сноски
				me.createNotebody(els);
				
				// новая сноска
				els.node = factory.createElement(me.elementName, {href: els.notebody.getId()});
				
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

				// текст сноски
				els.text = factory.createElementText(els.node.generateText());
				els.node.add(els.text, viewportId);
				
				// новый текстовый элемент c последней частью текста
				if (els.endValue)
				{
					els.t = factory.createElementText(els.endValue);
					
					if (els.next)
					{
						els.parent.insertBefore(els.t, els.next, viewportId);
					}
					else
					{
						els.parent.add(els.t, viewportId);
					}
				}
				
				if (els.sync.isRoot)
				{
					// синхронизируем корневой элемент
					els.sync.sync(viewportId);
				}
				else
				{
					// синхронизируем элемент
					els.parent.sync(viewportId);
					els.sync.sync(viewportId);
				}
				
				nodes.cursor = els.node.first().getNodeHelper().getNode(viewportId);
				
				// устанавливаем курсор
				manager.setCursor(
					{
						focus: true,
						withoutSyncButtons: true,
						startNode: nodes.cursor,
						startOffset: 1
					}
				);
				
				// сохраняем
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
				
				// удаляем тело сноски
				me.deleteNotebody(els);
				
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
				}
				else
				{
					// возвращаем старый текст
					els.start.setText(data.oldValue, viewportId);
					
					els.next = els.start.next();
					
					if (range.offset < els.start.getLength() && els.next)
					{
						// удаляем новый текстовый узел
						els.parent.remove(els.next, viewportId);
					}
				}
				
				if (els.sync.isRoot)
				{
					// синхронизируем корневой элемент
					els.sync.sync(viewportId);
				}
				else
				{
					// синхронизируем элемент
					els.parent.sync(viewportId);
					els.sync.sync(viewportId);
				}
				
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
		},
		
		/**
		 * @private
		 * Создает тело сноски.
		 * @param {Object} els
		 */
		createNotebody: function (els)
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				factory = manager.getFactory(),
				root = manager.getContent(),
				viewportId;
			
			viewportId = data.viewportId;
			
			els.notes = root.last();
			
			if (!els.notes.isNotes)
			{
				// создаем блок примечаний
				els.notes = factory.createElement('notes');
				els = Ext.apply(els, els.notes.createScaffold());
				root.add(els.notes, viewportId);
				els.sync = root;
			}
			else
			{
				// создаем
				els.notebody = factory.createElement('notebody');
				els.notebody.createScaffold();
				els.notes.add(els.notebody, viewportId);
				els.sync = els.notes;
			}
			
			els.notebody.generateNoteId();
		},
		
		/**
		 * @private
		 * Удаляет тело сноски.
		 * @param {Object} els
		 */
		deleteNotebody: function (els)
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				noteManager = manager.getNoteManager(),
				notesId = noteManager.getNotesId(),
				root = manager.getContent(),
				viewportId;
			
			viewportId = data.viewportId;
			
			if (notesId.length > 1)
			{
				// удаляем тело сноски
				els.notes.remove(els.notebody, viewportId);
			}
			else
			{
				// удаляем весь блок примечаний
				root.remove(els.notes, viewportId);
			}
		}
	}
);