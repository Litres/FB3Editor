/**
 * Плагин для клонирования групп полей формы, заключенных в контейнер.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.ux.FieldContainerReplicator',
	{
		alias: 'plugin.fieldcontainerreplicator',

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
		btnStyle: {},

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
		btnAddCfg: {
			text: 'Добавить'
		},

		/**
		 * @private
		 * @property {Object} Конфиг кнопки удаления.
		 */
		btnRemoveCfg: {
			text: 'Удалить'
		},

		/**
		 * @private
		 * @property {Object} Конфиг кнопки вложения.
		 */
		btnPutCfg: {
			text: 'Вложить'
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
		 */
		constructor: function(config)
		{
			var me = this;

			me.groupName = config.groupName || me.groupName;
			me.btnPos = config.btnPos || me.btnPos;
			me.btnAddCfg = config.btnAddCfg ? Ext.apply(me.btnAddCfg, config.btnAddCfg) : me.btnAddCfg;
			me.btnRemoveCfg = config.btnRemoveCfg ? Ext.apply(me.btnRemoveCfg, config.btnRemoveCfg) : me.btnRemoveCfg;
			me.btnStyle = config.btnStyle ? Ext.apply(me.btnStyle, config.btnStyle) : me.btnStyle;
			me.putStyle = config.putStyle ? Ext.apply(me.putStyle, config.putStyle) : me.putStyle;
			me.enableBtnPut = config.enableBtnPut || me.enableBtnPut;
			me.btnPutCfg = config.btnPutCfg ? Ext.apply(me.btnPutCfg, config.btnPutCfg) : me.btnPutCfg;
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
				'afterrender',
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
		 * @private
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
				buttons,
				items = [];

			btnPutCfg = Ext.apply(
				btnPutCfg,
				{
					handler: me.putFields,
					scope: me
				}
			);
			btnAddCfg = Ext.apply(
				btnAddCfg,
				{
					handler: me.addFields,
					scope: me
				}
			);
			btnRemoveCfg = Ext.apply(
				btnRemoveCfg,
				{
					handler: me.removeFields,
					scope: me
				}
			);
			items.push(btnRemoveCfg);
			items.push(btnAddCfg);
			if (enableBtnPut)
			{
				items.push(btnPutCfg);
			}
			buttons = [
				{
					xtype: 'fieldcontainer',
					hideLabel: true,
					flex: 0,
					height: '100%',
					defaults: {
						xtype: 'button',
						style: btnStyle
					},
					items: items
				}
			];

			return buttons;
		},

		/**
		 * @private
		 * Добавляет поля.
		 * @param {Ext.button.Button} Кнопка добавления.
		 */
		addFields: function (btn)
		{
			var me = this,
				container,
				removeBtn = btn.prev(),
				enableBtnPut = me.enableBtnPut,
				replicatorId,
				ownerCt,
				clone,
				idx;

			removeBtn.enable();
			container = enableBtnPut ? btn.ownerCt.ownerCt.ownerCt : btn.ownerCt.ownerCt;
			replicatorId = container.replicatorId;
			ownerCt = container.ownerCt;
			clone = container.cloneConfig({replicatorId: replicatorId});
			idx = ownerCt.items.indexOf(container);
			ownerCt.add(idx + 1, clone);
			me.checkLastInGroup(ownerCt, replicatorId);
		},

		/**
		 * @private
		 * Вкладывает поля.
		 * @param {Ext.button.Button} Кнопка вложения.
		 */
		putFields: function (btn)
		{
			var me = this,
				container = btn.ownerCt.ownerCt.ownerCt,
				putStyle = me.putStyle,
				removeBtn,
				replicatorId,
				clone;

			replicatorId = container.replicatorId + '-' + Ext.id();
			clone = container.cloneConfig(
				{
					replicatorId: replicatorId,
					style: putStyle
				}
			);
			container.add(clone);
			removeBtn = clone.query('button')[0];
			removeBtn.enable();
		},

		/**
		 * @private
		 * Удаляет поля.
		 * @param {Ext.button.Button} Кнопка удаления.
		 */
		removeFields: function (btn)
		{
			var me = this,
				enableBtnPut = me.enableBtnPut,
				container,
				ownerCt,
				replicatorId;

			container = enableBtnPut ? btn.ownerCt.ownerCt.ownerCt : btn.ownerCt.ownerCt;
			ownerCt = container.ownerCt;
			replicatorId = container.replicatorId;
			ownerCt.remove(container);
			me.checkLastInGroup(ownerCt, replicatorId);
		},

		/**
		 * @private
		 * Проверяет остался ли в группе последний контейнер.
		 * Если контейнер последний, то кнопка удаления становится неактивной.
		 * @param {Ext.container.Container} ownerCt Родительский контейнер группы контейнеров.
		 * @param {String} replicatorId Уникальный id группы контейнеров.
		 */
		checkLastInGroup: function (ownerCt, replicatorId)
		{
			var siblings,
				isLastInGroup,
				removeBtn;

			siblings = ownerCt.query('[replicatorId=' + replicatorId + ']');
			if (siblings.length)
			{
				isLastInGroup = siblings.length === 1;
				removeBtn = siblings[siblings.length - 1].query('button')[0];
				if (isLastInGroup)
				{
					removeBtn.disable();
				}
				else
				{
					removeBtn.enable();
				}
			}
		}
	}
);