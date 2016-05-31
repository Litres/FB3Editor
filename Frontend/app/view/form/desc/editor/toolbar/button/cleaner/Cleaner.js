/**
 * Кнопка Уборка.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.toolbar.button.cleaner.Cleaner',
	{
		extend: 'Ext.Button',
		requires: [
			'FBEditor.view.form.desc.editor.command.Clean'
		],

		xtype: 'form-desc-editor-toolbar-button-cleaner',

		html: '<i class="fa fa-paint-brush"></i>',
		tooltip: 'Уборка',
		tooltipType: 'title',

		handler: function ()
		{
			var me = this,
				editor = me.getEditor(),
				manager,
				history,
				cmd;

			// выполняем команду уборки

			manager = editor.getManager();
			history = manager.getHistory();
			cmd = Ext.create('FBEditor.view.form.desc.editor.command.Clean', {manager: manager});

			if (cmd.execute())
			{
				//history.clear();
				history.add(cmd);
			}
		},

		/**
		 * Возвращает редактор текста.
		 * @return {FBEditor.view.form.desc.editor.body.Body}
		 */
		getEditor: function ()
		{
			var me = this,
				editor;

			editor = me.editor || me.up('form-desc-editor').getBodyEditor();
			me.editor = editor;

			return editor;
		}
	}
);