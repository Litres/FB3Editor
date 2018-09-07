/**
 * Контроллер кнопки закрытия поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.close.CloseController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.panel.xml.search.close',

        onClick: function ()
        {
            var me = this,
                view = me.getView(),
	            searchPanel = view.getSearchPanel(),
	            xmlPanel,
	            xmlManager;

            // скрываем панель поиска
	        xmlPanel = searchPanel.getXmlPanel();
	        xmlManager = xmlPanel.getManager();
	        xmlManager.doEsc();
        }
    }
);