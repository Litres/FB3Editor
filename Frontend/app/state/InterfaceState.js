/**
 * Интерфейс для состояния.
 *
 * @interface
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.state.InterfaceState',
	{
		/**
		 * Инициализирует состояние.
		 */
		init: function ()
		{
			throw Error('Необходимо реализовать метод FBEditor.state.InterfaceState#init()');
		},
		
		/**
		 * Устанавливает значение.
		 * @param {String} name Имя значения.
		 * @param {*} value Значение.
		 */
		setItem: function (name, value)
		{
			throw Error('Необходимо реализовать метод FBEditor.state.InterfaceState#setItem()');
		},
		
		/**
		 * Возвращает значение.
		 * @param {String} name Имя значения.
		 * @return {*}
		 */
		getItem: function (name)
		{
			throw Error('Необходимо реализовать метод FBEditor.state.InterfaceState#getItem()');
		},
		
		/**
		 * Удаляет значение.
		 * @param {String} name Имя значения.
		 */
		removeItem: function (name)
		{
			throw Error('Необходимо реализовать метод FBEditor.state.InterfaceState#removeItem()');
		},
		
		/**
		 * Сохраняет состояние.
		 */
		save: function ()
		{
			throw Error('Необходимо реализовать метод FBEditor.state.InterfaceState#save()');
		}
	}
);