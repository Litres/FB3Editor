/**
 * Тулбар для вкладки Текст.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.toolbar.text.Text',
	{
		extend: 'FBEditor.view.panel.main.editor.toolbar.Toolbar',
		
		xtype: 'main-editor-toolbar-text',
		
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
					xtype: 'main-editor-button-strong'
				},
				{
					xtype: 'main-editor-button-em'
				},
				{
					xtype: 'main-editor-button-underline'
				},
				{
					xtype: 'main-editor-button-strikethrough'
				},
				{
					xtype: 'main-editor-button-sub'
				},
				{
					xtype: 'main-editor-button-sup'
				},
				{
					xtype: 'main-editor-button-smallcaps'
				},
				{
					xtype: 'main-editor-button-spacing'
				},
				spacer,
				{
					xtype: 'main-editor-button-code'
				},
				{
					xtype: 'main-editor-button-span'
				},
				spacer,
				{
					xtype: 'main-editor-button-img'
				},
				{
					xtype: 'main-editor-button-a'
				},
				{
					xtype: 'main-editor-button-note'
				},
				spacer,
				{
					xtype: 'panel-toolstab-button-find'
				},
				{
					xtype: 'panel-toolstab-button-replace'
				},
				spacer,
				{
					xtype: 'main-editor-button-unstyle'
				}
			];
			
			me.visibleButtons = buttons;
			
			return buttons;
		}
	}
);