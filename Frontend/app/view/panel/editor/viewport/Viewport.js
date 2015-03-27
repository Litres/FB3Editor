/**
 * Окно редактирования текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.editor.viewport.Viewport',
	{
		extend: 'Ext.container.Container',
		requires: [
			'FBEditor.view.panel.editor.viewport.content.Content'
		],
		xtype: 'panel-editor-viewport',
		layout: 'fit',
		cls: 'panel-editor-viewport',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-editor-viewport-content'
				}
			];
			me.callParent(this);
		},

		/**
		 * Загружает данные тела книги в окно редактора.
		 * @param {HTMLElement} data Тело книги.
		 */
		loadData: function (data)
		{
			var me = this,
				content;

			content = me.down('panel-editor-viewport-content');
			content.getEl().dom.innerHTML = data;
		}
	}
);