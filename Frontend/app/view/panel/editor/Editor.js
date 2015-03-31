/**
 * Редактор тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.editor.Editor',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.editor.EditorController',
			'FBEditor.view.panel.editor.viewport.Viewport'
		],
		id: 'main-editor',
		xtype: 'main-editor',
		controller: 'view.editor',
		layout: 'border',
		listeners: {
			loadData: 'onLoadData',
			split: 'onSplit',
			unsplit: 'onUnsplit',
			syncContent: 'onSyncContent'
		},

		/**
		 * @property {Object} Ссылки на активные окна редактирования.
		 * @property {FBEditor.view.panel.editor.viewport.Viewport} Object.north Верхнее окно.
		 * @property {FBEditor.view.panel.editor.viewport.Viewport} Object.south Нижнее окно.
		 */
		viewports: {
			north: null,
			south: null
		},

		/**
		 * @private
		 * @property {Object} Конфиг дополнительного окна редактирования.
		 */
		southViewportConfig: {
			xtype: 'panel-editor-viewport',
			height: '50%',
			split: {
				size: 8
			},
			region: 'south'
		},

		afterRender: function ()
		{
			var me = this,
				north;

			north = Ext.widget(
				{
					xtype: 'panel-editor-viewport',
					region: 'center'
				}
			);
			me.viewports.north = north;
			me.add(north);
			me.callParent(this);
		},

		/**
		 * Добавляет нижнее окно редактирования.
		 */
		addSouthViewport: function ()
		{
			var me = this,
				north,
				south;

			south = Ext.widget(me.southViewportConfig);
			me.viewports.south = south;
			me.add(south);
			north = me.viewports.north;
			me.fireEvent('syncContent', north);
			south.fireEvent('syncScroll', north);
		},

		/**
		 * Удалеят нижнее окно редактирования.
		 */
		removeSouthViewport: function ()
		{
			var me = this,
				south;

			south = me.viewports.south;
			me.remove(south);
			me.viewports.south = null;
		}
	}
);