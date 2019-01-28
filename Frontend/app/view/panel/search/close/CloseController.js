/**
 * Контроллер кнопки закрытия поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.search.close.CloseController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.panel.search.close',

        onClick: function ()
        {
            var me = this,
                view = me.getView(),
	            searchPanel = view.getSearchPanel(),
	            editorPanel,
	            manager;

            // скрываем панель поиска
	        editorPanel = searchPanel.getEditorPanel();
	        manager = editorPanel.getManager();
	        manager.doEsc();
        }
    }
);