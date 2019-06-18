/**
 * Контроллер пункта меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.contextmenu.item.split.SplitController',
	{
		extend: 'FBEditor.view.panel.main.editor.contextmenu.item.ItemController',
		
		alias: 'controller.contextmenu.main.editor.item.split',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				splitBtn;
			
			splitBtn = view.getSplitButton();
			
			// рассекаем секцию
			splitBtn.fireEvent('click', splitBtn, null);
		}
	}
);