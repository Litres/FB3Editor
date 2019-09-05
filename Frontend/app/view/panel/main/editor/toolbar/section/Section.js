/**
 * Тулбар для вкладки Главы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.toolbar.section.Section',
	{
		extend: 'FBEditor.view.panel.main.editor.toolbar.Toolbar',
		
		xtype: 'main-editor-toolbar-section',
		
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
					xtype: 'main-editor-button-titlebody'
				},
				{
					xtype: 'main-editor-button-title'
				},
				spacer,
				{
					xtype: 'main-editor-button-subtitle'
				},
				spacer,
				{
					xtype: 'main-editor-button-section'
				},
				{
					xtype: 'main-editor-button-splitsection'
				},
				spacer,
				{
					xtype: 'main-editor-button-epigraph'
				},
				{
					xtype: 'main-editor-button-subscription'
				},
				{
					xtype: 'main-editor-button-annotation'
				}/*,
				spacer,
				{
					xtype: 'main-editor-button-notes'
				},
				{
					xtype: 'main-editor-button-notebody'
				}*/
			];
			
			me.visibleButtons = buttons;
			
			return buttons;
		}
	}
);