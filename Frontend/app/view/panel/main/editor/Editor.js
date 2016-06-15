/**
 * Панель редактора текста книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.Editor',
	{
		extend: 'FBEditor.editor.view.Editor',
		requires: [
			'FBEditor.view.panel.main.editor.EditorController',
			'FBEditor.view.panel.main.editor.Manager',
			'FBEditor.view.panel.main.editor.toolbar.Toolbar',
			'FBEditor.view.panel.main.editor.viewport.Viewport'
		],

		id: 'main-editor',
		xtype: 'main-editor',
		controller: 'view.main.editor',

		layout: 'border',

		listeners: {
			loadData: 'onLoadData',
			split: 'onSplit',
			unsplit: 'onUnsplit',
			syncContent: 'onSyncContent'
		},

		rootElementName: 'fb3-body',

		/**
		 * @property {Object} Ссылки на активные окна редактирования.
		 * @property {FBEditor.editor.view.viewport.Viewport} Object.north Верхнее окно.
		 * @property {FBEditor.editor.view.viewport.Viewport} Object.south Нижнее окно.
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
			xtype: 'main-editor-viewport',
			height: '50%',
			split: {
				size: 8
			},
			region: 'south'
		},

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.content.Content} Панель контента.
		 */
		panelContent: null,

		createManager: function ()
		{
			var me = this;

			// создаем собственный менеджер для редактора тела книги
			me.manager = me.manager || Ext.create('FBEditor.view.panel.main.editor.Manager', me);
		},

		initEditor: function ()
		{
			var me = this,
				north;

			north = Ext.widget(
				{
					xtype: 'main-editor-viewport',
					region: 'center',
					createRootElement: true
				}
			);

			me.viewports.north = north;
			me.add(north);
		},

		createToolbar: function ()
		{
			return Ext.create('FBEditor.view.panel.main.editor.toolbar.Toolbar');
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
		 * Удаляет нижнее окно редактирования.
		 */
		removeSouthViewport: function ()
		{
			var me = this,
				manager = me.getManager(),
				south;

			south = me.viewports.south;

			// удаляем ссылки на узлы
			manager.removeNodes(south.id);

			me.remove(south);
			me.viewports.south = null;
		},

		/**
		 * Возвращает панель контента.
		 * @return {FBEditor.view.panel.main.content.Content}
		 */
		getPanelContent: function ()
		{
			var me = this,
				panel;

			panel = me.panelContent || Ext.getCmp('panel-main-content');

			return panel;
		},

		/**
		 * Возвращает окна редактирования текста.
		 * @return {FBEditor.view.panel.editor.viewport.Viewport[]} Окна редактирования текста.
		 */
		getViewports: function ()
		{
			var me = this,
				viewports = [];

			viewports.push(me.viewports.north);

			if (me.viewports.south)
			{
				viewports.push(me.viewports.south);
			}

			return viewports;
		}
	}
);