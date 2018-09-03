/**
 * Контроллер поля ввода текста для поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.find.textfield.TextfieldController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.panel.xml.search.find.textfield',

        onChange: function (cmp, newVal, oldVal)
        {
            var me = this,
                view = me.getView(),
                searchPanel;

            searchPanel = view.getSearchPanel();
            searchPanel.fireEvent('change');
        },
	
	    onKeydown: function (cmp, e)
        {
	        var me = this,
		        view = me.getView(),
		        searchPanel,
		        replacePanel,
	            xmlPanel,
	            xmlManager;

	        searchPanel = view.getSearchPanel();
	        replacePanel = searchPanel.getReplacePanel();
	
	        if (e.getKey() === Ext.event.Event.ESC)
            {
            	// скрываем панель поиска
	            xmlPanel = searchPanel.getXmlPanel();
	            xmlManager = xmlPanel.getManager();
	            xmlManager.doEsc();
            }
	        else if (e.getKey() === Ext.event.Event.F)
	        {
		        // скрываем панель замены
		        replacePanel.hide();
		
		        e.preventDefault();
	        }
	        else if (e.getKey() === Ext.event.Event.R)
	        {
		        // показываем панель замены
		        replacePanel.show();
		        
		        e.preventDefault();
	        }
        }
    }
);