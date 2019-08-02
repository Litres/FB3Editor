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
		 * Запоминает отдельно редактируемый элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 */
		setEditElement: function (el)
		{
			var me = this,
				xmlPath;
			
			// полный путь xml элемента с указанием позиции относительно родителя
			xmlPath = el.getXmlPath({position: true});
			console.log('xmlPath', xmlPath);
		}
	}
);