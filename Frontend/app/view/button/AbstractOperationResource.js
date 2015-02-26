/**
 * Абстракатный класс кнопки для операций над ресурсом.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.AbstractOperationResource',
	{
		extend: 'Ext.button.Button',
		width: '100%',

		/**
		 * @property {String} Класс команды, свзяанной с кнопкой.
		 */
		cmdClass: '',

		/**
		 * @private
		 * @property {String} Имя ресурса.
		 */
		nameResource: null,

		handler:  function ()
		{
			var me = this,
				cmdClass = me.cmdClass,
				cmd;

			cmd = Ext.create(cmdClass, {nameResource: me.nameResource});
			if (cmd && cmd.execute())
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