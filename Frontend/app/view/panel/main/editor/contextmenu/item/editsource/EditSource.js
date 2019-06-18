/**
 * Редактирование xml элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.contextmenu.item.editsource.EditSource',
	{
		extend: 'FBEditor.view.panel.main.editor.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.main.editor.contextmenu.item.editsource.EditSourceController'
		],
		
		xtype: 'contextmenu-main-editor-item-editsource',
		controller: 'contextmenu.main.editor.item.editsource',
		
		text: 'Редактировать исходник',
		
		/**
		 * Возвращает дерево навигации по тексту.
		 * @return {FBEditor.view.panel.treenavigation.body.Tree}
		 */
		getTreePanel: function ()
		{
			var me = this,
				panel;
			
			panel = Ext.getCmp('panel-body-navigation');
			
			return panel;
		},
		
		/**
		 * Возвращает дерево навигации по xml.
		 * @return {FBEditor.view.panel.treenavigation.xml.Tree}
		 */
		getXmlTreePanel: function ()
		{
			var me = this,
				panel;
			
			panel = Ext.getCmp('panel-xml-navigation');
			
			return panel;
		}
	}
);