/**
 * Тулбар для вкладки Блоки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.toolbar.div.Div',
	{
		extend: 'FBEditor.view.panel.main.editor.toolbar.Toolbar',
		
		xtype: 'main-editor-toolbar-div',
		
		getVisibleButtons: function ()
		{
			var me = this,
				responsiveSizes = me.responsiveSizes,
				spacer,
				buttons;
			
			me.currentResponsiveSize = responsiveSizes.fit;
			spacer = me.getSpacer();
			
			buttons = [
				{
					xtype: 'main-editor-button-table'
				},
				{
					xtype: 'main-editor-button-blockquote'
				},
				{
					xtype: 'main-editor-button-subtitle'
				},
				{
					xtype: 'main-editor-button-pre'
				},
				{
					xtype: 'main-editor-button-poem'
				},
				{
					xtype: 'main-editor-button-div'
				},
				{
					xtype: 'main-editor-button-splitelement'
				},
				spacer,
				{
					xtype: 'main-editor-button-ul'
				},
				{
					xtype: 'main-editor-button-ol'
				}
			];
			
			me.visibleButtons = buttons;
			
			return buttons;
		}
	}
);