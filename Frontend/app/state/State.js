/**
 * Состояние приложения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.state.State',
	{
		extend: 'FBEditor.state.InterfaceState',
		
		/**
		 * @private
		 * @property {String} Префикс для имен значений.
		 */
		prefix: 'state-',
		
		init: function ()
		{
			//
		},
		
		setItem: function (name, value)
		{
			var me = this,
				storage = me.getStorage(),
				val;
			
			name = me.getItemName(name);
			val = JSON.stringify(value);
			console.log('set', name, value);
			storage.setItem(name, val);
		},
		
		getItem: function (name)
		{
			var me = this,
				storage = me.getStorage(),
				item,
				val;
			
			name = me.getItemName(name);
			item = storage.getItem(name);
			val = JSON.parse(item);
			console.log('get', name, item, val);
			
			return val;
		},
		
		removeItem: function (name)
		{
			var me = this,
				storage = me.getStorage();
			
			name = me.getItemName(name);
			storage.removeItem(name);
			console.log('remove', name);
		},
		
		save: function ()
		{
			//
		},
		
		/**
		 * Возвращает хранилище.
		 * @return {Storage}
		 */
		getStorage: function ()
		{
			return sessionStorage;
		},
		
		/**
		 * Возвращает полное имя для значения с учетом префикса.
		 * @param {String} name Имя значения.
		 * @return {String}
		 */
		getItemName: function (name)
		{
			var me = this,
				prefix = me.prefix;
			
			name = prefix + name;
			
			return name;
		}
	}
);