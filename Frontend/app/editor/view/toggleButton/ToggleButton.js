/**
 * Кнопка переключения между редактором текста и редактором исходного xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toggleButton.ToggleButton',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.editor.view.toggleButton.ToggleButtonController'
		],

		xtype: 'editor-toggleButton',
		controller: 'editor.toggleButton',

		hidden: true,

		html: '<i class="fa fa-pencil"></i>',
		tooltipType: 'title',
		enableToggle: true,
		disabled: true,

		listeners: {
			click: 'onClick'
		},

		/**
		 * @private
		 * @property {FBEditor.editor.view.toolbar.Toolbar} Тулбар редактора текста.
		 */
		toolbar: null,

		translateText: {
			sourceEdit: 'Переключить на исходный xml',
			textEdit: 'Переключить на обычный текст'
		},

		initComponent: function ()
		{
			var me = this;

			me.tooltip = me.translateText.sourceEdit;

			me.callParent(arguments);
		},

		/**
		 * Переключает редактор на исходный xml.
		 */
		switchToSource: function ()
		{
			var me = this,
				toolbar = me.getToolbar(),
				editor;

			me.setTooltip(me.translateText.textEdit);

			editor = toolbar.getEditor();
			//editor.fireEvent('switchToSource');
		},

		/**
		 * Переключает редактор на обычный текст.
		 */
		switchToText: function ()
		{
			var me = this,
				toolbar = me.getToolbar(),
				editor;

			me.setTooltip(me.translateText.sourceEdit);

			editor = toolbar.getEditor();
			//editor.fireEvent('switchToText');
		},

		/**
		 * Возвращает тулбар.
		 * @return {FBEditor.editor.view.toolbar.Toolbar}
		 */
		getToolbar:  function ()
		{
			var me = this,
				toolbar;

			toolbar = me.toolbar || me.up('editor-toolbar');
			me.toolbar = toolbar;

			return toolbar;
		}
	}
);