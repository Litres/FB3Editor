/**
 * Элемент, позволяющий редактирование своей внутренней структуры html.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.editor.viewport.content.Content',
	{
		extend: 'Ext.Component',
		xtype: 'panel-editor-viewport-content',
		autoEl: 'div',
		width: '100%',
		height: '100%',
		autoScroll: true,
		cls: 'panel-editor-viewport-content',

		getElConfig: function()
		{
			var me = this,
				config = me.callParent();

			config.contentEditable = true;

			return config;
		}
	}
);