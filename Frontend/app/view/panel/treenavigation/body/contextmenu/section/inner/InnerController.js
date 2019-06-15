/**
 * Контроллер пункта меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.inner.InnerController',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.item.ItemController',
		
		alias: 'controller.contextmenu.treenavigation.body.section.inner',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				helper,
				node,
				sel,
				el;
			
			el = view.getElement();
			helper = el.getNodeHelper();
			node = helper.getNode();
			
			// корректируем текущее выделение
			sel = window.getSelection();
			sel.collapse(node, 0);
			
			// создаем вложенную секцию
			el.fireEvent('createElement', null, {inner: true});
		}
	}
);