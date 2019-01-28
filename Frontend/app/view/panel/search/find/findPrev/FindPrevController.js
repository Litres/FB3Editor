/**
 * Контроллер кнопки перемещения к предыдущему результату поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.find.findPrev.FindPrevController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.panel.search.find.findprev',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				searchPanel = view.getSearchPanel();
			
			// переходим к следующему результату поиска
			searchPanel.fireEvent('findPrev');
		}
	}
);