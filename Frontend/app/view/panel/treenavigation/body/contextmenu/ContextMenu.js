/**
 * Контекстное меню дерева навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.ContextMenu',
	{
		extend: 'FBEditor.view.contextmenu.ContextMenu',
		
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