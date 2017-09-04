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
		tooltipType: 'title',

		listeners: {
			click: 'onClick',
			sync: 'onSync'
		},

		elementName: null,

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
		 * @property {String[]} Список однотипных кнопок.
		 */
		sequence: null,

		/**
		 * Устанавливает список однотипных кнопок.
		 * @param {String[]} seq Список однотипных кнопок.
		 */
		setSequence: function (seq)
		{
			var me = this,
				sequence = [];
			
			Ext.each(
				seq,
			    function (item)
			    {
				    var btn;
				    
				    btn = Ext.ComponentQuery.query(item)[0];
				    sequence.push(btn);
			    }
			);
			
			me.sequence = sequence;
		},

		/**
		 * Возвращает список однотипных кнопок.
		 * @return {String[]} seq Список однотипных кнопок.
		 */
		getSequence: function ()
		{
			return this.sequence;
		},

		/**
		 * Устанавливает связь с панелью.
		 * @param {FBEditor.editor.view.toolbar.Toolbar} toolbar
		 */
		setToolbar: function (toolbar)
		{
			this.toolbar = toolbar;
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