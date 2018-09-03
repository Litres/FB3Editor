/**
 * Контроллер поля ввода текста для замены.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.replace.textfield.TextfieldController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.panel.xml.search.replace.textfield',
		
		onChange: function (cmp, newVal, oldVal)
		{
			//
		},
		
		onKeydown: function (cmp, e)
		{
			var me = this,
				view = me.getView(),
				searchPanel,
				replacePanel,
				xmlPanel,
				xmlManager;
			
			if (e.getKey() === Ext.event.Event.ENTER)
			{
				// выполняем замену
				searchPanel = view.getSearchPanel();
				searchPanel.replace();
			}
			else if (e.getKey() === Ext.event.Event.ESC)
			{
				// скрываем панель поиска/замены
				searchPanel = view.getSearchPanel();
				xmlPanel = searchPanel.getXmlPanel();
				xmlManager = xmlPanel.getManager();
				xmlManager.doEsc();
			}
			else if (e.getKey() === Ext.event.Event.F)
			{
				// скрываем панель замены
				searchPanel = view.getSearchPanel();
				replacePanel = searchPanel.getReplacePanel();
				replacePanel.hide();
				
				e.preventDefault();
			}
			else if (e.getKey() === Ext.event.Event.R)
			{
				// игнорируем обновление страницы
				e.preventDefault();
			}
		}
	}
);