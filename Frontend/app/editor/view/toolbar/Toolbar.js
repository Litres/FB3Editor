/**
 * Панель кнопок форматирования для редактора (тулбар).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.Toolbar',
	{
		extend: 'Ext.Toolbar',
		requires: [
			'FBEditor.editor.view.toggleButton.ToggleButton',
			'FBEditor.editor.view.toolbar.ToolbarController',
			'FBEditor.editor.view.toolbar.button.a.A',
			'FBEditor.editor.view.toolbar.button.em.Em',
			'FBEditor.editor.view.toolbar.button.strong.Strong'
		],

		xtype: 'editor-toolbar',
		controller: 'editor.toolbar',

		items: [
			{
				xtype: 'editor-toolbar-button-strong'
			},
			{
				xtype: 'editor-toolbar-button-em'
			},
			{
				xtype: 'editor-toolbar-button-a'
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'editor-toggleButton'
			}
		],

		listeners: {
			syncButtons: 'onSyncButtons',
			disableButtons: 'onDisableButtons'
		},

		hidden: true,

		/**
		 * @property {Boolean} Показывать ли по умолчанию тулбар.
		 */
		defaultShow: false,

		/**
		 * @private
		 * @property {FBEditor.editor.view.toolbar.button.AbstractButton[]} Кнопки элементов.
		 * @property {FBEditor.editor.view.toolbar.button.AbstractButton[]} [Object.sequence] Список кнопок.
		 * Список sequence содержит в себе однотипные кнопки элементов, которые проверяются по схеме одинаково.
		 */
		buttons: null,

		/**
		 * @private
		 * @property {FBEditor.editor.view.Editor} Редактор текста.
		 */
		editor: null,

		/**
		 * @private
		 * @property {FBEditor.editor.view.toggleButton.ToggleButton} Кнопка переключения между редактором исходного
		 * xml и редактором обычного текста.
		 */
		toggleButton: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.toolstab.main.Main} Вкладка Форматирование.
		 */
		toolstab:  null,

		afterRender: function ()
		{
			var me = this;

			me.callParent(arguments);

			// создаем список кнопок для синхронизации
			me.createButtons();
		},

		/**
		 * @template
		 * Создает список кнопок для синхронизации.
		 */
		createButtons: function ()
		{
			var me = this;

			me.buttons = [
				me.down('editor-toolbar-button-a'),
				me.down('editor-toolbar-button-em'),
				me.down('editor-toolbar-button-strong')
			];
		},

		/**
		 * Активен ли тулбар.
		 * @return {Boolean}
		 */
		isActive: function ()
		{
			var me = this,
				toolstab = me.getToolstab(),
				active;

			active = toolstab.isActiveToolbar(me);

			return active;
		},

		/**
		 * Делает тулбар активным.
		 */
		setActive: function ()
		{
			var me = this,
				toolstab = me.getToolstab(),
				active;

			active = toolstab.setActiveToolbar(me);

			return active;
		},

		/**
		 * Связывает тулбар с редактором текста.
		 * @param {FBEditor.editor.view.Editor} editor Редактор текста.
		 */
		setEditor: function (editor)
		{
			this.editor = editor;
		},

		/**
		 * Возвращает редактор текста.
		 * @returns {FBEditor.editor.view.Editor}
		 */
		getEditor: function ()
		{
			return this.editor;
		},

		/**
		 * Возвращает кнопку переключения между редактором исходного xml и редактором обычного текста.
		 * @return {FBEditor.editor.view.toggleButton.ToggleButton}
		 */
		getToggleButton: function ()
		{
			var me = this,
				btn;

			btn = me.toggleButton || me.down('editor-toggleButton');
			me.toggleButton = btn;

			return btn;
		},

		/**
		 * Возвращает кнопку по ее имени.
		 * @param {String} name Имя кнпоки.
		 * @return {FBEditor.editor.view.toolbar.button.AbstractButton}
		 */
		getButton: function (name)
		{
			var me = this,
				btn,
				xtype;

			//console.log(name);

			xtype = 'editor-toolbar-button-' + name;
			btn = me.down(xtype);

			return btn;
		},

		/**
		 * Возвращает список кнопок для синхронизации.
		 * @return {Object[]}
		 */
		getButtons: function ()
		{
			return this.buttons;
		},

		/**
		 * Устанавливает свойство для показа тулабара по умолчанию.
		 * @param {Boolean} show Показывать ли по умолчанию тулбар.
		 */
		setDefaultShow: function (show)
		{
			this.defaultShow = show;
		},

		/**
		 * Показывать ли по умолчанию тулбар.
		 * @return {Boolean}
		 */
		isDefaultShow: function ()
		{
			return this.defaultShow;
		},

		/**
		 * Возвращает вкладку Форматирование.
		 * @return {FBEditor.view.panel.toolstab.main.Main}
		 */
		getToolstab: function ()
		{
			var me = this,
				toolstab;

			toolstab = me.toolstab || Ext.getCmp('panel-toolstab-main');
			me.toolstab = toolstab;

			return toolstab;
		}
	}
);