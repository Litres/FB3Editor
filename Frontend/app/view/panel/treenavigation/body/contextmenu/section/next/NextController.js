/**
 * Контроллер пункта меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.next.NextController',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.section.ItemController',
		
		alias: 'controller.contextmenu.treenavigation.body.section.next',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				el;
			
			el = view.getElement();
			
			// корректируем выделение в тексте
			me.setSelection();
			
			// создаем секцию ниже
			el.fireEvent('createElement', null);
		}
	}
);