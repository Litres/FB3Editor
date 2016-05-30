/**
 * Абстрактная кнопка элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.AbstractButton',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.editor.view.toolbar.button.ButtonController'
		],

		controller: 'editor.toolbar.button',

		disabled: true,

		listeners: {
			click: 'onClick',
			sync: 'onSync'
		},

		/**
		 * @property {Object} Опции, которые передаются в команду создания элемента.
		 */
		createOpts: null,

		/**
		 * @private
		 * @property {FBEditor.editor.view.toolbar.Toolbar} Тулбар редактора текста.
		 */
		toolbar: null,

		/**
		 * @private
		 * @property {FBEditor.editor.view.toolbar.button.AbstractButton[]} Список однотипных кнопок.
		 */
		sequence: null,

		/**
		 * Устанавливает список однотипных кнопок.
		 * @param {FBEditor.editor.view.toolbar.button.AbstractButton[]} seq Список однотипных кнопок.
		 */
		setSequence: function (seq)
		{
			this.sequence = seq;
		},

		/**
		 * Возвращает список однотипных кнопок.
		 * @param {FBEditor.editor.view.toolbar.button.AbstractButton[]} seq Список однотипных кнопок.
		 */
		getSequence: function (seq)
		{
			return this.sequence;
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
		},

		/**
		 * Возвращает редактор текста.
		 * @return {FBEditor.editor.view.Editor}
		 */
		getEditor: function ()
		{
			var me = this,
				toolbar = me.getToolbar();

			return toolbar.getEditor();
		},

		/**
		 * Возвращает менеджер редактора текста.
		 */
		getEditorManager: function ()
		{
			var me = this,
				editor = me.getEditor();

			return editor.getManager();
		},

		/**
		 * Проверяет должна ли быть кнопка активной для текущего выделения в тексте.
		 * @return {Boolean} Активна ли.
		 */
		isActiveSelection: function ()
		{
			return false;
		}
	}
);