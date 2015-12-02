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
		btnStyle: {},

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
				btnCls = me.btnCls,
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
			buttons = [
				{
					xtype: 'fieldcontainer',
					cls: 'plugin-fieldcontainerreplicator ' + btnCls,
					hideLabel: true,
					flex: 0,
					height: '100%',
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
				idx;

			btn = btn || me.getBtnAdd();
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
				ownerCt.insert(0, clone);
			}
			else
			{
				// добавляем после текущего поля
				ownerCt.add(idx + 1, clone);
			}

			me.checkLastInGroup(ownerCt, replicatorId);
		},

		/**
		 * @private
		 * @event putFields
		 * Вкладывает поля.
		 * @param {Ext.button.Button} Кнопка вложения.
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
		 * @private
		 * @event removeFields
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
			ownerCt.fireEvent('removeFields');

			if (!/child/.test(replicatorId))
			{
				// если контейнер не является дочерним, то проверяем не является ли он последним
				me.checkLastInGroup(ownerCt, replicatorId);
			}
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