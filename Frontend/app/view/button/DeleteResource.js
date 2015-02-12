/**
 * Кнопка удаления ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.DeleteResource',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.command.DeleteResource'
		],
		id: 'button-delete-resource',
		xtype: 'button-delete-resource',
		text: 'Удалить',
		width: '100%',

		/**
		 * @private
		 * @property {String} Имя ресурса.
		 */
		nameResource: null,

		handler:  function ()
		{
			var me = this,
				cmd;

			cmd = Ext.create('FBEditor.command.DeleteResource', {nameResource: me.nameResource});
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		},

		/**
		 * Устанавливает имя ресурса.
		 * @param {String} name Имя ресурса.
		 */
		setResource: function (name)
		{
			this.nameResource = name;
		}
	}
);