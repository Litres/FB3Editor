/**
 * Контроллер чекбокса установки поиска целых слов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.find.words.WordsController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.panel.xml.search.find.words',
		
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