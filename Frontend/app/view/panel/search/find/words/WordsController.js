/**
 * Контроллер чекбокса установки поиска целых слов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.find.words.WordsController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.panel.search.find.words',
		
		onChange: function (cmp, newVal, oldVal)
		{
			var me = this,
				view = me.getView(),
				searchPanel;
			
			searchPanel = view.getSearchPanel();
			searchPanel.fireEvent('change');
		}
	}
);