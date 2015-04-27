/**
 * Менеджер упрпавления историей редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.HistoryManager',
	{
		singleton: 'true',

		/**
		 * @property {Array} Стек команд.
		 */
		data: [],

		/**
		 * @property {Number} Номер текущей команды в истории.
		 */
		pos: -1,

		/**
		 * Сбрасывает историю.
		 */
		clear: function ()
		{
			var me = this;

			me.data = [];
			me.pos = -1;
		},

		/**
		 * Добавляет команду в историю.
		 * @param {FBEditor.editor.command.AbstractCommand} cmd Команда.
		 */
		add: function (cmd)
		{
			var me = this,
				data = me.data;

			me.clearAfterCurrent();
			data.push(cmd);
			me.pos++;
		},

		/**
		 * Удаляет текущую команду из истории.
		 */
		remove: function ()
		{
			var me = this,
				data = me.data;

			console.log('remove cmd');
			if (me.pos !== -1)
			{
				data.splice(me.pos, 1);
				me.pos--;
			}
		},

		/**
		 * Удаляет следующую команду из истории.
		 */
		removeNext: function ()
		{
			var me = this,
				data = me.data;

			console.log('remove next cmd');
			if (me.pos + 1 < data.length)
			{
				data.splice(me.pos + 1, 1);
				//me.pos--;
			}
		},

		/**
		 * Отменяет действие текущей команды в истории и делает предудущую команду текущей.
		 */
		undo: function ()
		{
			var me = this,
				cmd;

			cmd = me.getCurrentCmd();
			if (cmd && cmd.unExecute())
			{
				me.pos--;
			}
		},

		/**
		 * Выполняет следующую команду истории и делает ее текущей.
		 */
		redo: function ()
		{
			var me = this,
				cmd;

			cmd = me.getNextCmd();
			if (cmd && cmd.execute())
			{
				me.pos++;
			}
		},

		/**
		 * Возвращает текущую команду.
		 * @return {FBEditor.editor.command.AbstractCommand} cmd Команда.
		 */
		getCurrentCmd: function ()
		{
			var me = this,
				data = me.data,
				cmd;

			cmd = me.pos !== -1 ? data.slice(me.pos, me.pos + 1)[0] : null;

			return cmd;
		},

		/**
		 * Возвращает следующую команду.
		 * @return {FBEditor.editor.command.AbstractCommand} cmd Команда.
		 */
		getNextCmd: function ()
		{
			var me = this,
				data = me.data,
				cmd;

			cmd = me.pos + 1 < data.length ? data.slice(me.pos + 1, me.pos + 2)[0] : null;

			return cmd;
		},

		/**
		 * Очищает историю команд после текущей.
		 */
		clearAfterCurrent: function ()
		{
			var me = this,
				data = me.data;

			if ((me.pos + 1) < data.length)
			{
				data.splice(me.pos + 1);
			}
		}
	}
);