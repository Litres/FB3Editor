/**
 * Кнопка переключения на описание книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.Desc',
	{
		extend: 'FBEditor.view.button.AbstractContent',
		requires: [
			'FBEditor.command.OpenDesc'
		],
		id: 'button-desc',
		xtype: 'button-desc',
		text: 'Описание книги',
		handler: function ()
		{
			this.openDesc();
		},

		getContentId: function ()
		{
			return 'form-desc';
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