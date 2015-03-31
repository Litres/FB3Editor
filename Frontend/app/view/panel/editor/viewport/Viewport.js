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
			'FBEditor.view.panel.editor.viewport.ViewportController',
			'FBEditor.view.panel.editor.viewport.content.Content'
		],
		xtype: 'panel-editor-viewport',
		controller: 'panel.editor.viewport',
		layout: 'fit',
		cls: 'panel-editor-viewport',
		listeners: {
			change: 'onChange',
			syncScroll: 'onSyncScroll'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-editor-viewport-content',
					listeners: {
						change: function (el, oldContent, newContent, evt)
						{
							this.fireEvent('change', oldContent, newContent);
						},
						scope: me
					}
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

			content = me.getContent();
			content.getEl().dom.innerHTML = data;
		},

		/**
		 * Возвращает элемент контента.
		 * @returns {FBEditor.view.panel.editor.viewport.content.Content}
		 */
		getContent: function ()
		{
			return this.down('panel-editor-viewport-content');
		}
	}
);