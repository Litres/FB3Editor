/**
 * Состояние приложения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.state.State',
	{
		extend: 'FBEditor.state.InterfaceState',
		
		// айди арта
		ITEM_ART_ID: 'art-id',
		
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
			var me = this,
				manager = FBEditor.getEditorManager(true),
				artId;
			
			// айди арта
			artId = manager.getArtId();
			
			if (artId)
			{
				me.saveArtId(artId);
			}
			else
			{
				me.removeArtId();
			}
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
		},
		
		/**
		 * Возвращает айди арта.
		 * @return {Number} Айди.
		 */
		getArtId: function ()
		{
			var me = this,
				id;
			
			id = me.getItem(me.ITEM_ART_ID);
			
			return id;
		},
		
		/**
		 * Сохраняет айди арта.
		 * @param {Number} id Айди.
		 */
		saveArtId: function (id)
		{
			var me = this;
			
			me.setItem(me.ITEM_ART_ID, id);
		},
		
		/**
		 * удаляет айди арта.
		 */
		removeArtId: function ()
		{
			var me = this;
			
			me.removeItem(me.ITEM_ART_ID);
		}
	}
);