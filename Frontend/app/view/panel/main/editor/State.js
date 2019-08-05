/**
 * Состояние редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.State',
	{
		extend: 'FBEditor.editor.State',
		
		ITEM_BODY_EDIT_ELEMENT_PATH: 'body-edit-element-path',
		
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
				editElement;
			
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
		},
		
		/**
		 * Восстанавливает состояние редактора текста после загрузки данных.
		 */
		restoreAfterLoadData: function ()
		{
			//
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

			me.setItem(me.ITEM_BODY_EDIT_ELEMENT_PATH, xmlPath);
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
			
			xmlPath = me.getItem(me.ITEM_BODY_EDIT_ELEMENT_PATH);
			
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
			var me = this;
			
			me.removeItem(me.ITEM_BODY_EDIT_ELEMENT_PATH);
		}
	}
);