/**
 * Абстрактная кнопка.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.AbstractButton',
	{
		extend: 'Ext.Button',
		requires: [
			'FBEditor.view.button.AbstractButtonController'
		],
		
		controller: 'view.button',
		xtype: 'view-button',
		
		listeners: {
			click: 'onClick'
		},
		
		tooltipType: 'title',
		
		/**
		 * @property {String} Подсказка кнопки.
		 */
		tooltipText: '',
		
		/**
		 * @property {Number} Номер слота горячей клавиши, к которому привязана кнопка.
		 */
		numberSlot: null,
		
		afterRender: function ()
		{
			var me = this;
			
			// инициализируем горячие клавиши для кнопки
			me.initHotkey();
			
			me.callParent(arguments);
		},
		
		/**
		 * Возвращает номер слота горячей клавиши, к которому привящана кнопка.
		 * @return {Number}
		 */
		getNumberSlot: function ()
		{
			return this.numberSlot;
		},
		
		/**
		 * @template
		 * Возвращает связи кнопок с горячими клавишами.
		 * @return {Object[]} Данные.
		 * @return {String} Object.xtype xtype кнопки.
		 * @return {Number} Object.numberSlot Номер слота.
		 */
		getHotkeys: function ()
		{
			var me = this,
				xtype = me.getXType(),
				numberSlot = me.getNumberSlot(),
				hotkeys;
			
			hotkeys = [
				{
					xtype: xtype,
					numberSlot: numberSlot
				}
			];
			
			return hotkeys;
		},
		
		/**
		 * @private
		 * Устанавливает горячие клавиши для кнопки.
		 */
		initHotkey: function ()
		{
			var me = this,
				xtype = me.getXType(),
				hotkeysManager = FBEditor.hotkeys.Manager,
				numberSlot,
				hotkeys,
				slot,
				data;
			
			// получаем связи кнопок с горячими клавишами
			hotkeys = me.getHotkeys();
			
			Ext.each(
				hotkeys,
				function (item)
				{
					if (item.xtype === xtype)
					{
						numberSlot = item.numberSlot;
						me.numberSlot = numberSlot;
						
						return false;
					}
				}
			);
			
			if (numberSlot)
			{
				// получаем слот горячей клавиши для текщуего элемента
				slot = hotkeysManager.getSlot(numberSlot);
				data = slot.getData();
				
				// обновляем подсказку кнопки
				me.updateTooltip(data);
			}
		},
		
		/**
		 * @private
		 * Обновляет подсказку кнопки.
		 * @param {Object} [data] Данные сочетания клавиш.
		 * @param {Number} data.slot
		 * @param {String} [data.key]
		 * @param {Boolean} [data.ctrl]
		 * @param {Boolean} [data.alt]
		 * @param {Boolean} [data.shift]
		 */
		updateTooltip: function (data)
		{
			var me = this,
				tooltip = me.tooltipText,
				hotkeysManager = FBEditor.hotkeys.Manager,
				keysText;
			
			if (data)
			{
				// текст сочетания клавиш
				keysText = hotkeysManager.getFormatKeysText(data);
				tooltip += keysText ? ' (' + keysText + ')' : '';
			}
			
			// подсказка кнопки
			me.setTooltip(tooltip);
		}
	}
);