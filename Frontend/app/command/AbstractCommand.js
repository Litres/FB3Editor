/**
 * Абстрактная команда.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.AbstractCommand',
	{
		extend: 'FBEditor.command.InterfaceCommand',

		/**
		 * @property {Object} Данные для команды.
		 */
		data: null,

		/**
		 * @private
		 * @property {window} Окно браузера, в котором должна быть выполнена команда.
		 */
		bridgeWindow: null,

		/**
		 * @param {Object} opts Данные.
		 */
		constructor: function (opts)
		{
			var me = this;

			me.data = opts;
			me.bridgeWindow = FBEditor.parentWindow || window;
		},

		/**
		 * Возвращает данные для команды.
		 * @return {Object} Данные для команды.
		 */
		getData: function ()
		{
			return this.data;
		},

		/**
		 * Возвращает окно браузера, в котором должна быть выполнена команда.
		 * @return {window} Окно браузера.
		 */
		getBridgeWindow: function ()
		{
			return this.bridgeWindow;
		}
	}
);