/**
 * Панель кнопок форматирования для редактора (тулбар).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.Toolbar',
	{
		extend: 'Ext.Toolbar',
		requires: [
			'FBEditor.editor.view.toolbar.ToolbarController',
			'FBEditor.editor.view.toolbar.button.a.A',
			'FBEditor.editor.view.toolbar.button.em.Em',
			'FBEditor.editor.view.toolbar.button.strong.Strong',
            'FBEditor.editor.view.toolbar.button.unstyle.Unstyle'
		],

		xtype: 'editor-toolbar',
		controller: 'editor.toolbar',

		listeners: {
			syncButtons: 'onSyncButtons',
			disableButtons: 'onDisableButtons'
		},

		hidden: true,

		/**
		 * @property {Boolean} Показывать ли по умолчанию тулбар.
		 */
		defaultShow: false,

		/**
		 * @private
		 * @property {String[]} Кнопки элементов.
		 * @property {String[]} [Object.sequence] Список кнопок для синхронизации.
		 * Список sequence содержит в себе однотипные кнопки элементов, которые проверяются по схеме одинаково.
		 */
		syncButtons: null,

        /**
         * @private
         * @property {Array} Хранит связи кнопок и горячих клавиш.
         */
        hotkeys: null,

		/**
		 * @private
		 * @property {FBEditor.editor.view.Editor} Редактор текста.
		 */
		editor: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.toolstab.main.Main} Вкладка Форматирование.
		 */
		toolstab:  null,

		afterRender: function ()
		{
			var me = this,
                hotkeysManager = FBEditor.hotkeys.Manager;

			me.callParent(arguments);

            // создаем список кнопок для синхронизации
			me.createSyncButtons();

			// связываем кнопки с горячими клавишами
			me.linkHotkeys();

			// отслеживаем обновление горячих клавиш
            hotkeysManager.on(
                {
                    changed: me.updateHotkeys,
					scope: me
                }
            );
		},

		/**
		 * @template
		 * Создает список кнопок для синхронизации.
		 */
		createSyncButtons: function ()
		{
			var me = this;

			me.syncButtons = [
				'editor-toolbar-button-a',
				'editor-toolbar-button-em',
				'editor-toolbar-button-strong',
                'editor-toolbar-button-unstyle'
			];
		},

        /**
         * @template
         * Связывает кнопки с горячими клавишами.
         */
        linkHotkeys: function ()
        {
            var me = this;

            me.hotkeys = [
                {
                    xtype: 'editor-toolbar-button-a',
                    numberSlot: 17
                },
                {
                    xtype: 'editor-toolbar-button-em',
                    numberSlot: 20
                },
                {
                    xtype: 'editor-toolbar-button-strong',
                    numberSlot: 19
                },
                {
                    xtype: 'editor-toolbar-button-unstyle',
                    numberSlot: 27
                }
            ];
        },

		/**
		 * Добавляет кнопку для синхронизации.
		 * @param {String} button xtype кнопки.
		 */
		addSyncButton: function (button)
		{
			this.syncButtons.push(button);
		},

		/**
		 * Активен ли тулбар.
		 * @return {Boolean}
		 */
		isActive: function ()
		{
			var me = this,
				toolstab = me.getToolstab(),
				active;

			active = toolstab.isActiveToolbar(me);

			return active;
		},

		/**
		 * Делает тулбар активным.
		 */
		setActive: function ()
		{
			var me = this,
				toolstab = me.getToolstab(),
				active;

			active = toolstab.setActiveToolbar(me);

			return active;
		},

		/**
		 * Связывает тулбар с редактором текста.
		 * @param {FBEditor.editor.view.Editor} editor Редактор текста.
		 */
		setEditor: function (editor)
		{
			this.editor = editor;
		},

		/**
		 * Возвращает редактор текста.
		 * @returns {FBEditor.editor.view.Editor}
		 */
		getEditor: function ()
		{
			return this.editor;
		},

        /**
         * Возвращает связи кнопок с горячими клавишами.
         * @return {Array}
         */
        getHotkeys: function ()
        {
            return this.hotkeys;
        },

		/**
		 * Возвращает кнопку по ее имени.
		 * @param {String} name Имя кнпоки.
		 * @return {FBEditor.editor.view.toolbar.button.AbstractButton}
		 */
		getButton: function (name)
		{
			var me = this,
				btn,
				xtype;

			xtype = 'editor-toolbar-button-' + name;
			btn = Ext.ComponentQuery.query(xtype)[0];

			return btn;
		},

        /**
		 * Возвращает кнопку, которая привязана к соответствуещему слоту горячих клавиш.
         * @param {Number} numberSlot Номер слота.
         * @return {FBEditor.editor.view.toolbar.button.AbstractButton} Кнопка.
         */
        getButtonForSlot: function (numberSlot)
        {
            var me = this,
                btn,
                query;

            query = 'editor-toolbar-button[numberSlot=' + numberSlot + ']';
			btn = me.down(query);

            return btn;
        },

        /**
         * Выполняет нажатие по кнопке форматирования, которая связана с соответствующим слотом горячих клавиш.
         * @param {Number} numberSlot Номер слота.
         */
        callClickButton: function (numberSlot)
        {
            var me = this,
                btn = me.getButtonForSlot(numberSlot);

            function doClick(button)
            {
                if (!button.disabled)
                {
                    if (button.enableToggle)
                    {
                        button.toggle();
                    }

                    button.fireEvent('click');
                }
            }

            function afterVerifyResult(button)
            {
                // удаляем событие, чтобы не было повтора
                button.removeListener('afterVerifyResult', afterVerifyResult);

                // делаем клик по кнопке
                doClick(button);

                // удаляем кнопку
                button.destroy();
            }

            //console.log('btn', numberSlot, btn);

            if (btn)
            {
                // клик по кнопке
                doClick(btn);
            }
            else
            {
                // создаем временную кнопку
                btn = me.createTempButton(numberSlot);
                
                if (btn)
                {
	                // событие вызовется после синхронизации кнопки
	                btn.on('afterVerifyResult',	afterVerifyResult);
	
	                // синхронизируем
	                btn.fireEvent('sync');
                }
            }
        },

        /**
         * Создает временную кнопку, которая потом будет удалена.
         * @param {Number} numberSlot Номер слота горячей клавиши.
         * @return {FBEditor.editor.view.toolbar.button.AbstractButton} Кнопка.
         */
        createTempButton: function (numberSlot)
        {
            var me = this,
                hotkeys = me.getHotkeys(),
                btn = null,
                xtype;

            Ext.each(
                hotkeys,
                function (item)
                {
                    if (item.numberSlot === numberSlot)
                    {
                        xtype = item.xtype;

                        return false;
                    }
                }
            );

            if (xtype)
            {
                btn = Ext.widget(xtype);
                btn.setToolbar(me);
            }

            return btn;
        },

		/**
		 * Возвращает список кнопок для синхронизации.
		 * @return {Object[]}
		 */
		getSyncButtons: function ()
		{
			return this.syncButtons;
		},

		/**
		 * Устанавливает свойство для показа тулабара по умолчанию.
		 * @param {Boolean} show Показывать ли по умолчанию тулбар.
		 */
		setDefaultShow: function (show)
		{
			this.defaultShow = show;
		},

		/**
		 * Показывать ли по умолчанию тулбар.
		 * @return {Boolean}
		 */
		isDefaultShow: function ()
		{
			return this.defaultShow;
		},

		/**
		 * Возвращает вкладку Форматирование.
		 * @return {FBEditor.view.panel.toolstab.main.Main}
		 */
		getToolstab: function ()
		{
			var me = this,
				toolstab;

			toolstab = me.toolstab || Ext.getCmp('panel-toolstab-main');
			me.toolstab = toolstab;

			return toolstab;
		},

        /**
		 * @private
		 * Обновляет подсказку горячих клавиш для кнопки.
         * @param {Object} data Данные сочетания клавиш.
         * @param {Number} data.slot
         * @param {String} [data.key]
         * @param {Boolean} [data.ctrl]
         * @param {Boolean} [data.alt]
         * @param {Boolean} [data.shift]
         */
        updateHotkeys: function (data)
		{
            var me = this,
                numberSlot,
                btn;

            numberSlot = data.slot;
            btn = me.getButtonForSlot(numberSlot);

            if (btn)
			{
				btn.updateTooltip(data);
			}
		}
	}
);