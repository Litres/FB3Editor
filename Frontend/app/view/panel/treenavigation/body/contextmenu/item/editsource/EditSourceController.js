/**
 * Контроллер пункта меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.item.editsource.EditSourceController',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.item.ItemController',
		
		alias: 'controller.contextmenu.treenavigation.body.item.editsource',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				el,
				treePanel,
				xmlTreePanel;
			
			el = view.getElement();
			
			// панель дерева навигации по тексту
			treePanel = view.getTreePanel();
			
			// снимаем выделение в дереве навигации по тексту
			treePanel.clearSelection();
			
			// панель дерева навигации по xml
			xmlTreePanel = view.getXmlTreePanel();
			
			// открываем редактирование xml элемента
			xmlTreePanel.fireEvent('openElement', el);
		}
	}
);