/**
 * Панель поиска в редакторе xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.Search',
    {
        extend: 'FBEditor.view.panel.search.Search',
	
	    id: 'panel-xml-search',
	    xtype: 'panel-xml-search',
	
	    idEditorPanel: 'main-xml'
    }
);