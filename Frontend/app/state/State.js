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
		
		/**
		 * @private
		 * @property {String} Имя парамтера в URL, который сообщает приложению о том,
		 * что необоходимо использовать сохраненное состояние приложения
		 */
		paramURL: 'savestate',
		
		init: function ()
		{
			var me = this,
				paramURL = me.paramURL,
				routeManager = FBEditor.route.Manager,
				isSaveState;
			
			// было ли сохранено состояние
			isSaveState = routeManager.isSetParam(paramURL);
			
			if (!isSaveState)
			{
				// очищаем состояние приложения
				me.clearAll();
				
				// добавляем параметр в URL
				routeManager.setParamToURL(paramURL);
			}
		},
		
		setItem: function (name, value)
		{
			var me = this,
				storage = me.getStorage(),
				val;
			
			name = me.getItemName(name);
			val = JSON.stringify(value);
			console.log('state set', name, value);
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
			console.log('state get', name, item, val);
			
			return val;
		},
		
		removeItem: function (name)
		{
			var me = this,
				storage = me.getStorage();
			
			name = me.getItemName(name);
			storage.removeItem(name);
			console.log('state remove', name);
		},
		
		save: function ()
		{
			//
		},
		
		/**
		 * Возвращает хранилище.
		 * @return {FBEditor.storage.Session}
		 */
		getStorage: function ()
		{
			return FBEditor.storage.Session;
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
		},
		
		/**
		 * Очищает все данные состояния.
		 */
		clearAll: function ()
		{
			var me = this,
				storage = me.getStorage(),
				prefix = me.prefix,
				reg;
			
			reg = new RegExp('^' + prefix);
			
			// перебираем все значения в хранилище
			storage.each(
				function (item)
				{
					if (reg.test(item))
					{
						// удаляем все значения состояния приложения
						storage.removeItem(item);
					}
				},
				me
			);
		}
	}
);