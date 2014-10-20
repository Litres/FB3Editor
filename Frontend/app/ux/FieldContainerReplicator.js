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
		 * @property {String} Стили для кнопок.
		 */
		btnStyle: '',

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
		 * @param {Object} config
		 * @param {String} config.groupName
		 * @param {'begin'|'end'} config.btnPos
		 * @param {Object} config.btnAddCfg
		 * @param {Object} config.btnRemoveCfg
		 * @param {String} config.btnStyle
		 */
		constructor: function(config)
		{
			var me = this;

			me.groupName = config.groupName || me.groupName;
			me.btnPos = config.btnPos || me.btnPos;
			me.btnAddCfg = config.btnAddCfg ? Ext.apply(me.btnAddCfg, config.btnAddCfg) : me.btnAddCfg;
			me.btnRemoveCfg = config.btnRemoveCfg ? Ext.apply(me.btnRemoveCfg, config.btnRemoveCfg) : me.btnRemoveCfg;
			me.btnStyle = config.btnStyle || me.btnStyle;
			me.callParent(arguments);
		},

		init: function (fieldcontainer)
		{
			var me = this,
				container = fieldcontainer,
				btnPos = me.btnPos,
				groupName = me.groupName,
				buttons = me.getButtons();

			container.on(
				'afterrender',
			    function (container)
			    {
				    me.checkLastInGroup(container.ownerCt, container.replicatorId);
			    }
			);

			// уникальный id группы контейнеров
			container.replicatorId = container.replicatorId || groupName + '-' + Ext.id();

			switch (btnPos)
			{
				case 'begin':
					container.insert(0, buttons);
					break;
				case 'end':
					container.add(buttons);
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
				buttons;

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
					items: [
						btnAddCfg,
						btnRemoveCfg
					]
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
				container = btn.ownerCt.ownerCt,
				removeBtn = btn.next(),
				replicatorId,
				ownerCt,
				clone,
				idx;

			removeBtn.enable();
			replicatorId = container.replicatorId;
			ownerCt = container.ownerCt;
			clone = container.cloneConfig({replicatorId: replicatorId});
			idx = ownerCt.items.indexOf(container);
			ownerCt.add(idx + 1, clone);
			me.checkLastInGroup(ownerCt, replicatorId);
		},

		/**
		 * @private
		 * Удаяляет поля.
		 * @param {Ext.button.Button} Кнопка удаления.
		 */
		removeFields: function (btn)
		{
			var me = this,
				container = btn.ownerCt.ownerCt,
				ownerCt,
				replicatorId;

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
			isLastInGroup = siblings.length === 1;
			removeBtn = siblings[siblings.length - 1].query('button')[1];
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
);