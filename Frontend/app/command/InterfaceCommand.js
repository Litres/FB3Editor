/**
 * Интерфейс команды.
 *
 * @interface
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.InterfaceCommand',
	{
		/**
		 * Выполоняет команду.
		 */
		execute: function ()
		{
			throw Error('Необходимо реализовать метод command.InterfaceCommand#execute');
		},

		/**
		 * Отменяет команду.
		 */
		unExecute: function ()
		{
			throw Error('Необходимо реализовать метод command.InterfaceCommand#unExecute');
		}
	}
);