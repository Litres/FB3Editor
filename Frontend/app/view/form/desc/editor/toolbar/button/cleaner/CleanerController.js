/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.toolbar.button.cleaner.CleanerController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.editor.toolbar.button.cleaner',

		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				editor = view.getEditor(),
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

		onSync: function ()
		{
			var me = this,
				view = me.getView(),
				editor = view.getEditor(),
				manager,
				focusEl;

			manager = editor.getManager();
			focusEl = manager.getFocusElement();

			if (focusEl)
			{
				// активируем кнопку
				view.enable();
			}
			else
			{
				view.disable();
			}
		}
	}
);