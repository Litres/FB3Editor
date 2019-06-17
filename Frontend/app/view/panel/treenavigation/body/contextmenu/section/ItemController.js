/**
 * Контроллер пункта меню секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.ItemController',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.item.ItemController',
		
		alias: 'controller.contextmenu.treenavigation.body.section.item',
		
		/**
		 * Устанавливает текущее выделение в тексте.
		 */
		setSelection: function ()
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
			sel = window.getSelection();
			sel.collapse(node, 0);
		}
	}
);