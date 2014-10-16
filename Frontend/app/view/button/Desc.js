/**
 * Кнопка описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.Desc',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.command.OpenDesc',
			'FBEditor.view.window.desc.Desc'
		],
		id: 'button-desc',
		xtype: 'button-desc',
		text: 'Описание книги',
		width: '100%',
		handler: function ()
		{
			this.openDesc();
		},

		/**
		 * Открывает описание книги.
		 */
		openDesc: function ()
		{
			var cmd;

			cmd = Ext.create('FBEditor.command.OpenDesc');
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);