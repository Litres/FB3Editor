/**
 * Кнотроллер элемента title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.title.TitleElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.title.CreateCommand'
		],

		/**
		 * Создает новый заголовок.
		 */
		onCreateElement: function (sel)
		{
			var cmd;

			cmd = Ext.create('FBEditor.editor.command.title.CreateCommand', {sel: sel});
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		}
	}
);