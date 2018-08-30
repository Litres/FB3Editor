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
	            xmlPanel,
	            xmlManager;
	
	        if (e.getKey() === Ext.event.Event.ESC)
            {
            	// скрываем панель поиска
	            searchPanel = view.getSearchPanel();
	            xmlPanel = searchPanel.getXmlPanel();
	            xmlManager = xmlPanel.getManager();
	            xmlManager.doEsc();
            }
        }
    }
);