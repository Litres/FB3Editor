/**
 * Хранилище сессии.
 * Надстройка над Window.sessionStorage.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.storage.Session',
	{
		singleton: true,
		
		/**
		 * @private
		 * @property {sessionStorage} Хранилище сессии.
		 */
		storage: null,
		
		constructor: function ()
		{
			var me = this;
			
			me.storage = sessionStorage;
		},
		
		clear: function ()
		{
			return this.storage.clear();
		},
		
		getItem: function (name)
		{
			return this.storage.getItem(name);
		},
		
		key: function (number)
		{
			return this.storage.key(number);
		},
		
		removeItem: function (name)
		{
			return this.storage.removeItem(name);
		},
		
		setItem: function (name, value)
		{
			this.storage.setItem(name, value);
		},
		
		/**
		 * Итерирует все хранилище.
		 * @param {Function} fn Функция-итератор.
		 * @param {Object} [scope] Область видимости.
		 */
		each: function (fn, scope)
		{
			var me = this,
				storage = me.storage,
				pos = 0,
				item;
			
			scope = scope || me;
			
			while (pos < storage.length)
			{
				item = storage.key(pos);
				pos++;
				fn.apply(scope, [item, pos - 1]);
			}
		}
	}
);