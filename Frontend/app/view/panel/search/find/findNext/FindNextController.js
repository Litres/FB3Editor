/**
 * Контроллер кнопки перемещения к следующему результату поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.find.findNext.FindNextController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.panel.search.find.findnext',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				searchPanel = view.getSearchPanel();
			
			// переходим к следующему результату поиска
			searchPanel.fireEvent('findNext');
		}
	}
);