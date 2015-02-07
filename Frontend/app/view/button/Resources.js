/**
 * Кнопка переключения контетна на текст книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.Resources',
	{
		extend: 'FBEditor.view.button.AbstractContent',
		requires: [
			'FBEditor.command.OpenResources'
		],
		id: 'button-resources',
		xtype: 'button-resources',
		text: 'Ресурсы (рисунки, ...)',
		handler: function ()
		{
			this.openResources();
		},

		getContentId: function ()
		{
			return 'panel-resources';
		},

		/**
		 * Открывает ресурсы книги.
		 */
		openResources: function ()
		{
			var cmd;

			cmd = Ext.create('FBEditor.command.OpenResources');
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);