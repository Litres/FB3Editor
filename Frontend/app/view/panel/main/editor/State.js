/**
 * Состояние редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.State',
	{
		extend: 'FBEditor.editor.State',
		
		/**
		 * @const {String} Отдельно редактируемый элемент.
		 */
		ITEM_BODY_EDIT_ELEMENT: 'body-edit-element',
		
		/**
		 * @const {String} Данные выделения в тексте.
		 */
		ITEM_BODY_RANGE: 'body-cursor-range',
		
		init: function ()
		{
			var me = this,
				manager = me.getManager(),
				editor;
			
			me.callParent(arguments);
			
			// редактор тела
			editor = manager.getEditor();
			
			// отслеживаем завершение загрузки данных в редакторе тела
			editor.on('afterLoadData', me.restoreAfterLoadData, me);
		},
		
		save: function ()
		{
			var me = this,
				manager = me.getManager(),
				appState = me.getAppState(),
				range,
				editElement,
				artId;
			
			// айди арта
			artId = manager.getArtId();
			
			if (artId)
			{
				appState.saveArtId(artId);
			}
			else
			{
				appState.removeArtId();
			}
			
			// отдельно редактируемый элемент
			editElement = manager.getEditElement();
			
			if (editElement)
			{
				me.saveEditElement(editElement);
			}
			else
			{
				me.removeEditElement();
			}
			
			//позиция курсора
			range = manager.getRangeCursor();
			
			if (range)
			{
				me.saveRange(range);
			}
			else
			{
				me.removeRange();
			}
		},
		
		/**
		 * Восстанавливает состояние редактора текста после загрузки данных.
		 */
		restoreAfterLoadData: function ()
		{
			var me = this,
				manager = me.getManager(),
				appStateManager = me.getAppManager(),
				appState = appStateManager.getState(),
				artId,
				stateArtId;
			
			// сохраненный айди арта
			stateArtId = appState.getArtId();
			
			// текущий айди арта
			artId = manager.getArtId();
			
			if (artId === stateArtId)
			{
				// если айди арта не поменялось, то восстанавливаем состояние после загрузки данных в редакторе текста
				
				me.restoreEditElement();
				me.restoreRange();
			}
		},
		
		/**
		 * Запоминает отдельно редактируемый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 */
		saveEditElement: function (el)
		{
			var me = this,
				xmlPath;
			
			// полный путь xml элемента
			xmlPath = el.getXmlPath();

			me.setItem(me.ITEM_BODY_EDIT_ELEMENT, xmlPath);
		},
		
		/**
		 * Восстанавливает режим отдельно редактируемого элемента.
		 */
		restoreEditElement: function ()
		{
			var me = this,
				manager = me.getManager(),
				xmlPath,
				el;
			
			xmlPath = me.getItem(me.ITEM_BODY_EDIT_ELEMENT);
			
			if (xmlPath)
			{
				// получаем элемент по его xml-пути
				el = manager.getElementByXmlPath(xmlPath);
				
				if (el && !el.isRoot)
				{
					manager.setEditElement(el);
				}
			}
		},
		
		/**
		 * Удаляет отдельно редактируемый элемент.
		 */
		removeEditElement: function ()
		{
			this.removeItem(this.ITEM_BODY_EDIT_ELEMENT);
		},
		
		/**
		 * Сохраняет выделение в тексте.
		 * @param {FBEditor.editor.Range} range Данные теущего выделения.
		 */
		saveRange: function (range)
		{
			var me = this,
				data;
			
			data = {
				collapsed: range.collapsed,
				offset: range.offset,
				common: range.common.getElement().getXmlPath(),
				start: range.start.getElement().getXmlPath(),
				end: range.end.getElement().getXmlPath()
			};
			
			me.setItem(me.ITEM_BODY_RANGE, data);
		},
		
		/**
		 * Восстанавливает выделение в тексте.
		 */
		restoreRange: function ()
		{
			var me = this,
				manager = me.getManager(),
				helper,
				range,
				data,
				start,
				startHelper,
				end;
			
			range = me.getItem(me.ITEM_BODY_RANGE);
			
			if (range)
			{
				start = manager.getElementByXmlPath(range.start);
				startHelper = start ? start.getNodeHelper() : null;
				start = startHelper ? startHelper.getNode() : null;
				
				end = manager.getElementByXmlPath(range.end);
				helper = end ? end.getNodeHelper() : null;
				end = helper ? helper.getNode() : null;
				
				if (start && end)
				{
					data = {
						startNode: start,
						endNode: end,
						startOffset: range.offset.start,
						endOffset: range.offset.end
					};
					
					// небольшая задержка с учетом рендеринга
					Ext.defer(
						function ()
						{
							// прокрутка скролла
							startHelper.scrollIntoView();
							
							// установка курсора
							manager.setCursor(data);
						},
						500,
						me
					);
				}
			}
		},
		
		/**
		 * Удаляет выделение в тексте.
		 */
		removeRange: function ()
		{
			var me = this;
			
			me.removeItem(me.ITEM_BODY_RANGE);
		}
	}
);