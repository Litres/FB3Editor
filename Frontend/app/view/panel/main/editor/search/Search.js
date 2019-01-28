/**
 * Панель поиска в редакторе текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.search.Search',
	{
		extend: 'Ext.Panel',
		
		id: 'main-editor-search',
		xtype: 'main-editor-search',
		
		html: 'search panel',
		
		hidden: true
	}
);