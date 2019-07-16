/**
 * Контроллер пункта меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.item.editelement.EditElementController',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.item.ItemController',
		
		alias: 'controller.contextmenu.treenavigation.body.item.editelement',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				el;
			
			el = view.getElement();
			console.log('edit el', el);
			alert('Данный функционал находится в разработке.')
		}
	}
);