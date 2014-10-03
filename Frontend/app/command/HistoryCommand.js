/**
 * История комманд.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.HistoryCommand',
	{
		singleton: true,
		alternateClassName: 'FBEditor.HistoryCommand',

		/**
		 * @private
		 * @property {Ext.util.MixedCollection} Коллекция комманд.
		 */
		commands: null,

		/**
		 * @private
		 * @property {Number} Указывает на текущую команду в истории.
		 * Первая команда имеет индекс 0.
		 */
		currentIndex: -1,

		/**
		 * Инициализирует историю команд.
		 */
		init: function ()
		{
			var me = this;

			me.commands = new Ext.util.MixedCollection();
		},

		/**
		 * Добавляет в историю комманду.
		 * @param {FBEditor.command.InterfaceCommand} command Комманда.
		 */
		add: function (command)
		{
			var me = this,
				currentIndex;

			currentIndex = me.currentIndex;
			me.commands.add(currentIndex, command);
			currentIndex++;
			me.currentIndex = currentIndex;
		}
	}
);