/**
 * Адаптивная кнопка, скрывающая в себе все остальные кнопки, которые не поместились на панели форматирования.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.toolbar.responsive.button.Button',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.panel.main.editor.toolbar.responsive.button.ButtonController',
			'FBEditor.view.panel.main.editor.toolbar.responsive.panel.Panel'
		],

		xtype: 'main-editor-toolbar-responsive-button',
		controller: 'main.editor.toolbar.responsive.button',

		html: '<i class="fa fa-angle-double-right"></i>',

		listeners: {
			click: 'onClick',
			align: 'onAlign'
		},

		config: {
			keyHandlers: {
				ESC: 'onEscKey'
			}
		},
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.toolbar.Toolbar} Родительская панель.
		 */
		toolbar: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.responsive.panel.Panel} Адаптивная панель.
		 */
		responsivePanel: null,

		initComponent: function ()
		{
			var me = this;

			me.getResponsivePanel();

			me.callParent(arguments);
		},

		onDestroy: function ()
		{
			var me = this,
				toolbar = me.getToolbar();

			// подчищаем данные в панели
			toolbar.setResponsiveButton(null);
		},

		/**
		 * Закрывает панель при нажатии на Esc.
		 */
		onEscKey: function ()
		{
			var me = this,
				responsivePanel = me.getResponsivePanel();

			responsivePanel.close();
		},

		/**
		 * Возвращает адаптивную панель.
		 * @return {FBEditor.view.panel.main.editor.responsive.panel.Panel}
		 */
		getResponsivePanel: function ()
		{
			var me = this,
				responsivePanel = me.responsivePanel;

			responsivePanel = responsivePanel ||
			                  Ext.ComponentQuery.query('main-editor-toolbar-responsive-panel')[0] ||
			                  Ext.widget('main-editor-toolbar-responsive-panel');

			me.responsivePanel = responsivePanel;

			// уставналвиваем связь
			responsivePanel.setResponsiveButton(me);

			return responsivePanel;
		},

		/**
		 * Устанавливает связь с родительской панелью.
		 * @param {FBEditor.view.panel.main.editor.toolbar.Toolbar} toolbar
		 */
		setToolbar: function (toolbar)
		{
			this.toolbar = toolbar;
		},

		/**
		 * Возвращает родительскую панель.
		 * @return {FBEditor.view.panel.main.editor.toolbar.Toolbar}
		 */
		getToolbar: function ()
		{
			var me = this,
				toolbar;

			toolbar = me.toolbar || me.up('main-editor-toolbar');
			me.toolbar = toolbar;

			return toolbar;
		}
	}
);