/**
 * Плагин для клонирования групп полей формы, заключенных в контейнер.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.ux.FieldContainerReplicator',
	{
		extend: 'Ext.plugin.Abstract',
		alias: 'plugin.fieldcontainerreplicator',
		pluginId: 'fieldcontainerreplicator',

		/**
		 * @private
		 * @property {String} Имя группы, в которой происходит клонирование.
		 */
		groupName: 'fieldcontainerreplicator',

		/**
		 * @private
		 * @property {'begin'|'end'} Указывает с какой стороны должны быть добавлены кнопки в контейнер.
		 * begin - с начала, end - с конца.
		 */
		btnPos: 'end',

		/**
		 * @private
		 * @property {Object} Стили для кнопок.
		 */
		btnStyle: null,

		/**
		 * @private
		 * @property {Object} Размеры для кнопок.
		 * @property {String} Object.bigWidth Ширина для больших кнопок (используется по умолчанию, если передано).
		 * @property {String} Object.bigHeight Высота для больших кнопок (используется по умолчанию, если передано).
		 * @property {String} Object.smallWidth Ширина для маленьких кнопок.
		 * @property {String} Object.smallHeight Высота для маленьких кнопок.
		 */
		btnSize: null,

		/**
		 * @private
		 * @property {Object} Класс для группы кнопок.
		 */
		btnCls: '',

		/**
		 * @private
		 * @property {Object} Стили для полей, которые вкладываются.
		 */
		putStyle: {
			marginLeft: '20px'
		},

		/**
		 * @private
		 * @property {Boolean} Надо ли показывать кнопку 'Вложить'.
		 */
		enableBtnPut: false,

		/**
		 * @private
		 * @property {Object} Конфиг кнопки добавления.
		 */
		btnAddCfg: null,

		/**
		 * @private
		 * @property {Object} Конфиг кнопки удаления.
		 */
		btnRemoveCfg: null,

		/**
		 * @private
		 * @property {Object} Конфиг кнопки вложения.
		 */
		btnPutCfg: null,

		/**
		 * @private
		 * @property {Boolean} Всегда ли добавлять новые поля в начало контейнера.
		 */
		alwaysInsertFirst: false,

		translateText: {
			add: 'Добавить',
			remove: 'Удалить',
			put: 'Вложить'
		},

		/**
		 * @param {Object} config
		 * @param {String} config.groupName
		 * @param {'begin'|'end'} config.btnPos
		 * @param {Object} config.btnAddCfg
		 * @param {Object} config.btnRemoveCfg
		 * @param {Object} config.btnStyle
		 * @param {Boolean} config.enableBtnPut
		 * @param {Object} config.btnPutCfg
		 * @param {String} config.btnCls
		 */
		constructor: function(config)
		{
			var me = this;
			
			me.btnAddCfg = {
				html: '<i class="fa fa-plus" title="' + me.translateText.add + '"></i>',
				cls: 'btn-plus'
			};
			me.btnRemoveCfg = {
				html: '<i class="fa fa-minus" title="' + me.translateText.remove + '"></i>',
				cls: 'btn-minus'
			};
			me.btnPutCfg = {
				html: '<i class="fa fa-level-down" title="' + me.translateText.put + '"></i>',
				cls: 'btn-put'
			};
			me.groupName = config.groupName || me.groupName;
			me.btnPos = config.btnPos || me.btnPos;
			me.btnAddCfg = config.btnAddCfg ? Ext.apply(me.btnAddCfg, config.btnAddCfg) : me.btnAddCfg;
			me.btnRemoveCfg = config.btnRemoveCfg ? Ext.apply(me.btnRemoveCfg, config.btnRemoveCfg) : me.btnRemoveCfg;
			me.btnStyle = config.btnStyle ? Ext.apply(me.btnStyle, config.btnStyle) : me.btnStyle;
			me.btnSize = config.btnSize ? Ext.apply(me.btnSize, config.btnSize) : me.btnSize;
			me.putStyle = config.putStyle ? Ext.apply(me.putStyle, config.putStyle) : me.putStyle;
			me.enableBtnPut = config.enableBtnPut || me.enableBtnPut;
			me.btnPutCfg = config.btnPutCfg ? Ext.apply(me.btnPutCfg, config.btnPutCfg) : me.btnPutCfg;
			me.btnCls = config.btnCls || me.btnCls;
			me.alwaysInsertFirst = config.alwaysInsertFirst || me.alwaysInsertFirst;

			me.callParent(arguments);
		},

		init: function (fieldcontainer)
		{
			var me = this,
				container = fieldcontainer,
				btnPos = me.btnPos,
				groupName = me.groupName,
				buttons = me.getButtons(),
				enableBtnPut = me.enableBtnPut,
				containerAdd;

			container.on(
				'added',
			    function (container)
			    {
				    me.checkLastInGroup(container.ownerCt, container.replicatorId);
			    }
			);

			// уникальный id группы контейнеров
			container.replicatorId = container.replicatorId || groupName + '-' + Ext.id();

			// контейнер, в который добавляются кнопки
			containerAdd = enableBtnPut ? container.items.last() : container;

			switch (btnPos)
			{
				case 'begin':
					containerAdd.insert(0, buttons);
					break;
				case 'end':
					containerAdd.add(buttons);
					break;
			}
		},

		/**
		 * Возвращает кнопку добавления.
		 * @return {Ext.button.Button}
		 */
		getBtnAdd: function ()
		{
			var me = this;

			return me.getCmp().query('[name=fieldcontainerreplicator-btn-add-' + me.groupName + ']')[0];
		},

		/**
		 * Возвращает кнопку удаления.
		 * @return {Ext.button.Button}
		 */
		getBtnRemove: function ()
		{
			var me = this;

			return me.getCmp().query('[name=fieldcontainerreplicator-btn-remove-' + me.groupName + ']')[0];
		},

		/**
		 * Возвращает кнопку вложения.
		 * @return {Ext.button.Button}
		 */
		getBtnPut: function ()
		{
			var me = this;

			return me.getCmp().query('[name=fieldcontainerreplicator-btn-put-' + me.groupName + ']')[0];
		},

		/**
		 * Изменяет размер кнопок.
		 * @param {Boolean} isBig Большие ли кнопки.
		 */
		setSizeButtons: function (isBig)
		{
			var me = this,
				btnSize = me.btnSize,
				btnWidth,
				btnHeigth,
				buttons;

			buttons = [
				me.getBtnAdd(),
			    me.getBtnRemove(),
			    me.getBtnPut()
			];

			Ext.Array.each(
				buttons,
			    function (btn)
			    {
				    // если существует конфиг с размерами кнопок, то изменяем размер
				    if (btn && btnSize && btnSize.bigWidth)
				    {
					    btnWidth = isBig ? btnSize.bigWidth : btnSize.smallWidth;
					    btnHeigth = isBig ? btnSize.bigHeight : btnSize.smallHeight;
					    btn.setSize(btnWidth, btnHeigth);
				    }
			    }
			);
		},

		/**
		 * @event addFields
		 * Добавляет поля.
		 * @param {[Ext.button.Button]} btn Кнопка добавления.
		 */
		addFields: function (btn)
		{
			var me = this,
				enableBtnPut = me.enableBtnPut,
				container,
				removeBtn,
				replicatorId,
				ownerCt,
				clone,
				focusField,
				idx;

			btn = btn || me.getBtnAdd();

			if (btn)
			{
				removeBtn = btn.prev();
				removeBtn.enable();
				container = enableBtnPut ? btn.ownerCt.ownerCt.ownerCt : btn.ownerCt.ownerCt;
				replicatorId =  container.replicatorId;
				ownerCt = container.ownerCt;
				clone = container.cloneConfig({replicatorId: replicatorId});
				idx = ownerCt.items.indexOf(container);

				if (me.alwaysInsertFirst)
				{
					// добавляем в начало контейнера
					idx = 0;
					ownerCt.insert(idx, clone);
				}
				else
				{
					// добавляем после текущего поля
					idx = idx + 1;
					ownerCt.add(idx, clone);
				}

				clone.fireEvent('addFields');

				focusField = ownerCt.items.getAt(idx).down('field:focusable');

				if (focusField)
				{
					// ставим фокус
					focusField.focus();
				}

				me.checkLastInGroup(ownerCt, replicatorId);
			}
		},

		/**
		 * @event putFields
		 * Вкладывает поля.
		 * @param {Ext.button.Button} btn Кнопка вложения.
		 * @return {Ext.container.Container} Возвращает вложенный контейнер.
		 */
		putFields: function (btn)
		{
			var me = this,
				putStyle = me.putStyle,
				container,
				removeBtn,
				replicatorId,
				clone;

			btn = btn || me.getBtnPut();
			container = btn.ownerCt.ownerCt.ownerCt;
			replicatorId = container.replicatorId + '-child';

			clone = container.cloneConfig(
				{
					replicatorId: replicatorId,
					style: putStyle
				}
			);

			clone.on(
				'afterrender',
				function ()
				{
					this.down('field:focusable').focus();
				}
			);

			removeBtn = clone.down('[name=fieldcontainerreplicator-btn-remove-' + me.groupName + ']');

			removeBtn.on(
				'afterrender',
				function ()
				{
					this.enable();
				}
			);

			container.add(clone);
			clone.fireEvent('putFields', btn);

			return clone;
		},

		/**
		 * @event removeFields
		 * Удаляет поля.
		 * @param {Ext.button.Button} btn Кнопка удаления.
		 */
		removeFields: function (btn)
		{
			var me = this,
				enableBtnPut = me.enableBtnPut,
				container,
				ownerCt,
				replicatorId;

			btn = btn || me.getBtnRemove();
			container = enableBtnPut ? btn.ownerCt.ownerCt.ownerCt : btn.ownerCt.ownerCt;
			ownerCt = container.ownerCt;
			replicatorId = container.replicatorId;
			ownerCt.remove(container);
			ownerCt.fireEvent('removeFields', btn);

			if (!/child/.test(replicatorId))
			{
				// если контейнер не является дочерним, то проверяем не является ли он последним
				me.checkLastInGroup(ownerCt, replicatorId);
			}
		},

		/**
		 * @private
		 * @event afterRenderPlugin
		 * Возвращает контейнер с кнопками.
		 * @return {Ext.form.FieldContainer}
		 */
		getButtons: function ()
		{
			var me = this,
				btnStyle = me.btnStyle,
				btnAddCfg = me.btnAddCfg,
				btnRemoveCfg = me.btnRemoveCfg,
				enableBtnPut = me.enableBtnPut,
				btnPutCfg = me.btnPutCfg,
				btnCls = me.btnCls,
				btnSize = me.btnSize,
				buttons,
				items = [];

			btnPutCfg = Ext.apply(
				btnPutCfg,
				{
					handler: me.putFields,
					scope: me,
					name: 'fieldcontainerreplicator-btn-put-' + me.groupName
				}
			);
			btnAddCfg = Ext.apply(
				btnAddCfg,
				{
					handler: me.addFields,
					scope: me,
					name: 'fieldcontainerreplicator-btn-add-' + me.groupName
				}
			);
			btnRemoveCfg = Ext.apply(
				btnRemoveCfg,
				{
					handler: me.removeFields,
					scope: me,
					name: 'fieldcontainerreplicator-btn-remove-' + me.groupName
				}
			);

			items.push(btnRemoveCfg);
			items.push(btnAddCfg);

			if (enableBtnPut)
			{
				items.push(btnPutCfg);
			}

			if (btnSize)
			{
				// устанавливаем размеры кнопок по умолчанию
				Ext.Array.each(
					items,
				    function (btnCfg)
				    {
					    btnCfg.width = btnSize.bigWidth;
					    btnCfg.height = btnSize.bigHeight;
				    }
				);
			}

			buttons = [
				{
					xtype: 'fieldcontainer',
					cls: 'plugin-fieldcontainerreplicator ' + btnCls,
					hideLabel: true,
					flex: 0,
					height: '100%',
					listeners: {
						afterrender: function ()
						{
							// уведомляем компонент о рендеринге плагина
							me.getCmp().fireEvent('afterRenderPlugin');
						}
					},
					defaults: {
						xtype: 'button',
						tabIndex: -1,
						style: btnStyle
					},
					items: items
				}
			];

			return buttons;
		},

		/**
		 * @private
		 * Проверяет остался ли в группе последний контейнер.
		 * Если контейнер последний, то кнопка удаления становится неактивной.
		 * @param {Ext.container.Container} ownerCt Родительский контейнер группы контейнеров.
		 * @param {String} replicatorId Уникальный id группы контейнеров.
		 * @return {Boolean} Последний ли контейнер.
		 */
		checkLastInGroup: function (ownerCt, replicatorId)
		{
			var me = this,
				siblings,
				isLastInGroup,
				removeBtn;

			siblings = ownerCt.query('[replicatorId=' + replicatorId + ']');
			if (siblings.length)
			{
				isLastInGroup = siblings.length === 1;
				removeBtn = siblings[siblings.length - 1].
					query('[name=fieldcontainerreplicator-btn-remove-' + me.groupName + ']')[0];
				if (isLastInGroup)
				{
					removeBtn.disable();
				}
				else
				{
					removeBtn.enable();
				}
			}

			return isLastInGroup;
		}
	}
);