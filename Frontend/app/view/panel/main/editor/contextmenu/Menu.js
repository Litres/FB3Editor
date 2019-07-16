/**
 * Контекстное меню редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.contextmenu.Menu',
	{
		extend: 'FBEditor.view.contextmenu.ContextMenu',
		requires: [
			'FBEditor.view.panel.main.editor.contextmenu.item.convert.Convert',
			'FBEditor.view.panel.main.editor.contextmenu.item.editelement.EditElement',
			'FBEditor.view.panel.main.editor.contextmenu.item.editsource.EditSource',
			'FBEditor.view.panel.main.editor.contextmenu.item.split.Split'
		],
		
		xtype: 'contextmenu-main-editor',
		
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
			
			me.items = [
				{
					xtype: 'contextmenu-main-editor-item-convert'
				},
				{
					xtype: 'contextmenu-main-editor-item-split'
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'contextmenu-main-editor-item-editelement'
				},
				{
					xtype: 'contextmenu-main-editor-item-editsource'
				}
			];
			
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