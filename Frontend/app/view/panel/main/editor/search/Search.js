/**
 * Панель поиска в редакторе текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.search.Search',
	{
		extend: 'FBEditor.view.panel.search.Search',
		
		id: 'main-editor-search',
		xtype: 'main-editor-search',
		
		idEditorPanel: 'main-editor',
		
		getText: function ()
		{
			var me = this,
				editorPanel,
				manager,
				range,
				text;
			
			editorPanel = me.getEditorPanel();
			manager = editorPanel.getManager();
			range = manager.getRangeCursor();
			
			// получаем выделенный текст из редактора
			text = range ? range.toString() : '';
			
			return text;
		}
	}
);