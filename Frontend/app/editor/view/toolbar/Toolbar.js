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
			}
		],

		listeners: {
			syncButtons: 'onSyncButtons',
			disableButtons: 'onDisableButtons'
		},

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
		 * Возвращает список кнопок для синхронизации.
		 * @return {Object[]}
		 */
		getButtons: function ()
		{
			return this.buttons;
		}
	}
);