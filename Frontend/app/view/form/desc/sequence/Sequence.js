/**
 * Серия, в которой выпущено произведение.
 * Например "Детство, Отрочество, Юность" для книги Толстого "Детство".
 * Не путать серию с названием периодического издания.
 * Вложенность серий обозначает "многоуровневые" серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.Sequence',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.sequence.CustomContainer',
			'FBEditor.view.form.desc.sequence.SearchContainer',
			'FBEditor.view.form.desc.sequence.SequenceController'
		],

		id: 'form-desc-sequence',
		xtype: 'form-desc-sequence',
		controller: 'form.desc.sequence',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		listeners: {
			resetFields: 'onResetFields',
			loadData: 'onLoadData',
			putData: 'onPutData',
			putFields: 'onPutFields',
			removeFields: 'onRemoveFields'
		},

		layout: 'anchor',

		prefixName: 'sequence',

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			number: 'Номер'
		},

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.sequence.CustomContainer} Контейнер данных.
		 */
		_customContainer: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.sequence.SearchContainer} Контейнер поиска.
		 */
		_searchContainer: null,

		initComponent: function ()
		{
			var me = this,
				prefixName = me.prefixName;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					cls: 'desc-fieldcontainer',
					layout: 'anchor',
					anchor: '100%',
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: prefixName,
						btnPos: 'end',
						btnCls: 'plugin-fieldcontainerreplicator-big-btn',
						enableBtnPut: true,
						btnStyle: {
							margin: '0 0 0 5px',
							width: '40px',
							height: '65px'
						}
					},
					listeners: {
						putData: function (data)
						{
							me.fireEvent('putData', data, this);
						},
						putFields: function (btn)
						{
							me.fireEvent('putFields', this, btn);
						},
						removeFields: function ()
						{
							me.fireEvent('removeFields', this);
						},
						resetContainer: function ()
						{
							var btn;

							// скрываем поля поиска, показываем поля данных
							btn = this.down('form-desc-sequence-customBtn');
							btn.switchContainers();
						}
					},
					getValues: function ()
					{
						var me = this,
							itemInner = me.items.getAt(1),
							values;

						values = {
							_id: me.down('[name=' + prefixName + '-id]').getValue(),
							_number: me.down('[name=' + prefixName + '-number]').getValue(),
							title: me.down('[name=' + prefixName + '-title]').getValues()
						};
						if (itemInner)
						{
							values[prefixName] = itemInner.getValues();
						}
						values = me.removeEmptyValues(values);

						return values;
					},
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'desc-fieldcontainer',
									layout: 'anchor',
									flex: 1,
									items: [
										{
											xtype: 'form-desc-sequence-container-custom',
											prefixName: me.prefixName
										},
										{
											xtype: 'form-desc-sequence-container-search',
											prefixName: me.prefixName
										}
									]
								}
							]
						}
					]
				}
			];
			me.callParent(arguments);
		},

		/**
		 * Возвращает контейнер данных.
		 * @return {FBEditor.view.form.desc.sequence.CustomContainer}
		 */
		getCustomContainer: function ()
		{
			var me = this,
				container = me._customContainer;

			container = container || me.down('form-desc-sequence-container-custom');
			me._customContainer = container;

			return container;
		},

		/**
		 * Возвращает контейнер поиска.
		 * @return {FBEditor.view.form.desc.sequence.SearchContainer}
		 */
		getSearchContainer: function ()
		{
			var me = this,
				container = me._searchContainer;

			container = container || me.down('form-desc-sequence-container-search');
			me._searchContainer = container;
			
			return container;
		},

		getValues: function (d)
		{
			var me = this,
				prefixName = me.prefixName,
				items = me.items,
				data = d || null,
				values = null;

			items.each(
				function (item)
				{
					var val;

					val = item.getValues();

					if (val)
					{
						values = values || [];
						values.push(val);
					}
				}
			);

			if (values)
			{
				data = data || {};
				data[prefixName] = values;
			}

			return data;
		}
	}
);