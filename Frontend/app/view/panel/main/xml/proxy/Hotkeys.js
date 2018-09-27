/**
 * Прокси горячих клавиш в редакторе xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.proxy.Hotkeys',
	{
		/**
		 * @private
		 * @const {Number} Номер слота горячих клавиш для поиска.
		 */
		HOTKEY_SLOT_SEARCH: 32,
		
		/**
		 * @private
		 * @const {Number} Номер слота горячих клавиш для замены.
		 */
		HOTKEY_SLOT_REPLACE: 33,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.main.xml.proxy.Editor} Прокси внешнего редактора xml.
		 */
		proxy: null,
		
		/**
		 * @private
		 * @property {Object} Хранит связи слотов горячих клавиш с функциями.
		 */
		hotkeysLinks: null,
		
		/**
		 * @param {FBEditor.view.panel.main.xml.proxy.Editor} proxy Прокси внешнего редактора xml.
		 */
		constructor: function (proxy)
		{
			var me = this;
			
			me.proxy = proxy;
		},
		
		/**
		 * Инициализирует горячие клавиши.
		 * @param {FBEditor.view.panel.main.xml.Manager} manager Менеджер редактора xml.
		 */
		init: function (manager)
		{
			var me = this,
				hotkeysManager = me.getHotkeysManager();
			
			me.manager = manager;
			
			// устанавливаем функцию для клавиши Esc
			me.setEscFunction(manager.doEsc);
			
			// устанавливаем сочетание горячих клавиш для поиска
			me.setHotkeysFn(manager.doSearch, me.HOTKEY_SLOT_SEARCH);
			
			// устанавливаем сочетание горячих клавиш для замены
			me.setHotkeysFn(manager.doReplace, me.HOTKEY_SLOT_REPLACE);
			
			// регистрируем изменение горячих клавиш
			hotkeysManager.on(
				{
					scope: me,
					changed: me.changeHotkeys
				}
			);
		},
		
		/**
		 * Возвращает прокси внешнего редактора.
		 * @return {FBEditor.view.panel.main.xml.proxy.Editor}
		 */
		getProxy: function ()
		{
			return this.proxy;
		},
		
		/**
		 * Возвращает внешний редактор xml.
		 * @return {Object}
		 */
		getLib: function ()
		{
			var me = this,
				proxy = me.getProxy();
			
			return proxy.getLib();
		},
		
		/**
		 * Возвращает менеджер горячих клавиш.
		 * @return {FBEditor.hotkeys.Manager}
		 */
		getHotkeysManager: function ()
		{
			return FBEditor.hotkeys.Manager;
		},
		
		/**
		 * @private
		 * Устанавливает функцию Esc.
		 * @param {Function} fn Функция, которая будет вызвана при нажатии Esc.
		 */
		setEscFunction: function (fn)
		{
			var me = this,
				lib = me.getLib(),
				option;
			
			option = lib.getOption('extraKeys');
			option = option || {};
			option['Esc'] = fn;
			lib.setOption('extraKeys', option);
		},
		
		/**
		 * @private
		 * Устанавливает функцию для горячих клавиш.
		 * @param {Function} fn Функция.
		 * @param {Number} numberSlot Номер слота горячих клавиш.
		 */
		setHotkeysFn: function (fn, numberSlot)
		{
			var me = this,
				lib = me.getLib(),
				hotkeysManager = me.getHotkeysManager(),
				oldKeys,
				keys,
				slot,
				data,
				option;
			
			// уже используемое сочетание клавиш
			oldKeys = me.getLinkKeys(numberSlot);
			
			// устанавливаем связь слота горячих клавиш с функцией
			me.setLinkFn(numberSlot, fn);
			
			// данные слота горячих клавиш
			slot = hotkeysManager.getSlot(numberSlot);
			data = slot.getData();
			keys = me.getFormatHotkeys(data);
			
			option = lib.getOption('extraKeys');
			option = option || {};
			
			if (option[oldKeys])
			{
				// удаляем старое сочетание горячих клавиш
				delete option[oldKeys];
			}

			// регистрируем горячие клавиши
			option[keys] = fn;
			lib.setOption('extraKeys', option);
		},
		
		/**
		 * @private
		 * Изменяет горячие клавиши.
		 * @param {Object} data Данные, измененных горячих клавиш.
		 */
		changeHotkeys: function (data)
		{
			var me = this,
				numberSlot = data.slot,
				fn;
			
			fn = me.getLinkFn(numberSlot);
			
			if (fn)
			{
				// устанавливаем новое сочетание горячих клавиш для функции
				me.setHotkeysFn(fn, numberSlot);
			}
		},
		
		/**
		 * @private
		 * Формирует название сочетания клавиш из переданных данных.
		 * @param {Object} data Данные сочетания клавиш.
		 * @param {String} [data.key]
		 * @param {Boolean} [data.ctrl]
		 * @param {Boolean} [data.alt]
		 * @param {Boolean} [data.shift]
		 * @return {String} Название.
		 */
		getFormatHotkeys: function (data)
		{
			var text,
				split;
			
			split = '-';
			text = data.shift ? 'Shift' + split : '';
			text += data.ctrl ? 'Ctrl' + split : '';
			text += data.alt ? 'Alt' + split : '';
			text += data.key ? data.key : '';
			
			return text;
		},
		
		/**
		 * @private
		 * Устанавливает связь слота горячих клавиш с функцией.
		 * @param {Number} numberSlot Номер слота.
		 * @param {Function} fn Функция.
		 */
		setLinkFn: function (numberSlot, fn)
		{
			var me = this,
				links = me.hotkeysLinks,
				hotkeysManager = me.getHotkeysManager(),
				keys,
				slot,
				data;
			
			// данные слота горячих клавиш
			slot = hotkeysManager.getSlot(numberSlot);
			data = slot.getData();
			keys = me.getFormatHotkeys(data);
			
			links = links || {};
			links[numberSlot] = {
				numberSlot: numberSlot,
				keys: keys,
				fn: fn
			};
			
			me.hotkeysLinks = links;
		},
		
		/**
		 * @private
		 * Возвращает функцию связанную со  слотом горячих клавиш.
		 * @param {Number} numberSlot Номер слота.
		 * @return {Function}
		 */
		getLinkFn: function (numberSlot)
		{
			var me = this,
				links = me.hotkeysLinks,
				fn;
			
			fn = links && links[numberSlot] ? links[numberSlot].fn : null;
			
			return fn;
		},
		
		/**
		 * @private
		 * Возвращает сочетание горячих клавиш.
		 * @param {Number} numberSlot Номер слота.
		 * @return {String}
		 */
		getLinkKeys: function (numberSlot)
		{
			var me = this,
				links = me.hotkeysLinks,
				keys;
			
			keys = links && links[numberSlot] ? links[numberSlot].keys : null;
			
			return keys;
		}
	}
);