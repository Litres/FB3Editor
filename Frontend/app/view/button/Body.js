/**
 * Кнопка переключения контетна на текст книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.Body',
	{
		extend: 'FBEditor.view.button.AbstractContent',
		requires: [
			'FBEditor.command.OpenBody'
		],
		id: 'button-body',
		xtype: 'button-body',
		text: 'Текст',
		handler: function ()
		{
			this.openBody();
		},

		getContentId: function ()
		{
			return 'main-htmleditor';
		},

		/**
		 * Открывает текст книги.
		 */
		openBody: function ()
		{
			var cmd;

			cmd = Ext.create('FBEditor.command.OpenBody');
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);