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
		onCreateElement: function ()
		{
			var me = this,
				el = me.getElement(),
				cmd,
				sel;

			sel = FBEditor.editor.Manager.getSelection();
			if (sel)
			{
				cmd = Ext.create('FBEditor.editor.command.title.CreateCommand', {title: el, sel: sel});
				if (cmd.execute())
				{
					FBEditor.editor.HistoryManager.add(cmd);
				}
			}
		}
	}
);