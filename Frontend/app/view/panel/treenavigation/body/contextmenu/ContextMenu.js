/**
 * Контекстное меню дерева навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.ContextMenu',
	{
		extend: 'FBEditor.view.contextmenu.ContextMenu',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.item.editelement.EditElement',
			'FBEditor.view.panel.treenavigation.body.contextmenu.item.editsource.EditSource'
		],
		
		xtype: 'contextmenu-treenavigation-body',
		
		/**
		 * @param {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		element: null,
		
		/**
		 * @param {Object} cfg
		 * @param {FBEditor.editor.element.AbstractElement} cfg.element Элемент.
		 */
		constructor: function (cfg)
		{
			var me = this;
			
			me.element = cfg.element;
			
			me.callParent(arguments);
		},
		
		initComponent: function ()
		{
			var me = this;
			
			me.items = me.getItems();
			
			me.callParent(arguments);
		},
		
		/**
		 * Возвращает пункты меню.
		 * @return {Object}
		 */
		getItems: function ()
		{
			var items;
			
			items = [
				{
					xtype: 'contextmenu-treenavigation-body-item-editelement'
				},
				{
					xtype: 'contextmenu-treenavigation-body-item-editsource'
				}
			];
			
			return items;
		},
		
		/**
		 * Возвращает элемент.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getElement: function ()
		{
			return this.element;
		}
	}
);