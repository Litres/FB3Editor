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
	
	    idEditorPanel: 'main-xml',
	
	    getText: function ()
	    {
		    var me = this,
			    editorPanel,
			    manager,
			    proxyEditor,
			    text;
		
		    editorPanel = me.getEditorPanel();
		    manager = editorPanel.getManager();
		    proxyEditor = manager.getProxyEditor();
		
		    // получаем выделенный текст из редактора
		    text = proxyEditor.getSelection();
		    
		    return text;
	    }
    }
);