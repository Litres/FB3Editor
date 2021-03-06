/**
 * Контроллер поля ввода текста для замены.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.replace.textfield.TextfieldController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.panel.search.replace.textfield',
		
		onChange: function (cmp, newVal, oldVal)
		{
			//
		},
		
		onKeyDown: function (cmp, e)
		{
			var me = this,
				view = me.getView(),
				searchPanel,
				replacePanel;
			
			searchPanel = view.getSearchPanel();
			
			if (e.getKey() === Ext.event.Event.ENTER)
			{
				// выполняем замену
				searchPanel.replace();
			}
			else if (e.getKey() === Ext.event.Event.ESC)
			{
				// скрываем панель поиска/замены
				xmlManager.doEsc();
			}
			else if (e.getKey() === Ext.event.Event.F && e.ctrlKey)
			{
				// скрываем панель замены
				replacePanel = searchPanel.getReplacePanel();
				replacePanel.hide();
				
				e.preventDefault();
			}
			else if (e.getKey() === Ext.event.Event.R && e.ctrlKey)
			{
				// игнорируем обновление страницы
				e.preventDefault();
			}
		}
	}
);