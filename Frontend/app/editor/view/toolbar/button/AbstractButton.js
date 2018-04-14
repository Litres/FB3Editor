/**
 * Абстрактная кнопка элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.AbstractButton',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.editor.view.toolbar.button.ButtonController'
		],

		controller: 'editor.toolbar.button',
        xtype: 'editor-toolbar-button',

        listeners: {
            click: 'onClick',
            sync: 'onSync'
        },

		disabled: true,
		tooltipType: 'title',

        /**
		 * @property {String} Имя элемента.
         */
		elementName: '',

        /**
         * @property {String} Подсказка кнопки.
         */
        tooltipText: '',

        /**
		 * @property {Number} Номер слота горячей клавиши, к которому привязана кнопка.
         */
        numberSlot: null,

		/**
		 * @property {Object} Опции, которые передаются в команду создания элемента.
		 */
		createOpts: null,

		/**
		 * @private
		 * @property {FBEditor.editor.view.toolbar.Toolbar} Тулбар редактора текста.
		 */
		toolbar: null,

		/**
		 * @private
		 * @property {String[]} Список однотипных кнопок.
		 */
		sequence: null,

		afterRender: function ()
		{
			var me = this;

			// инициализируем горячие клавиши для кнопки
			me.initHotkey();

			me.callParent(arguments);
		},

		/**
		 * Устанавливает список однотипных кнопок.
		 * @param {String[]} seq Список однотипных кнопок.
		 */
		setSequence: function (seq)
		{
			var me = this,
				sequence = [];
			
			Ext.each(
				seq,
			    function (item)
			    {
				    var btn;
				    
				    btn = Ext.ComponentQuery.query(item)[0];
				    sequence.push(btn);
			    }
			);
			
			me.sequence = sequence;
		},

		/**
		 * Возвращает список однотипных кнопок.
		 * @return {String[]} seq Список однотипных кнопок.
		 */
		getSequence: function ()
		{
			return this.sequence;
		},

		/**
		 * Устанавливает связь с панелью.
		 * @param {FBEditor.editor.view.toolbar.Toolbar} toolbar
		 */
		setToolbar: function (toolbar)
		{
			this.toolbar = toolbar;
		},

		/**
		 * Возвращает тулбар.
		 * @return {FBEditor.editor.view.toolbar.Toolbar}
		 */
		getToolbar:  function ()
		{
			var me = this,
				toolbar;

			toolbar = me.toolbar || me.up('editor-toolbar');
			me.toolbar = toolbar;

			return toolbar;
		},

		/**
		 * Возвращает редактор текста.
		 * @return {FBEditor.editor.view.Editor}
		 */
		getEditor: function ()
		{
			var me = this,
				toolbar = me.getToolbar();

			return toolbar.getEditor();
		},

		/**
		 * Возвращает активный менеджер редактора текста.
		 */
		getEditorManager: function ()
		{
			return FBEditor.getEditorManager();
		},

		/**
		 * Проверяет должна ли быть кнопка активной для текущего выделения в тексте.
		 * @return {Boolean} Активна ли.
		 */
		isActiveSelection: function ()
		{
			return false;
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
		 * @private
		 * Устанавливает горячие клавиши для кнопки.
         */
        initHotkey: function ()
		{
			var me = this,
				toolbar = me.getToolbar(),
				xtype = me.getXType(),
				hotkeysManager = FBEditor.hotkeys.Manager,
				numberSlot,
				hotkeys,
				slot,
				data;

			// получаем связи кнопок с горячими клавишами
			hotkeys = toolbar.getHotkeys();

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
			}

            me.updateTooltip(data);
		},

        /**
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