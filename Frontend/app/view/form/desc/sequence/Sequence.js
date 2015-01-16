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
			'FBEditor.view.form.desc.sequence.SequenceController'
		],
		id: 'form-desc-sequence',
		xtype: 'form-desc-sequence',
		controller: 'form.desc.sequence',
		name: 'form-desc-plugin-fieldcontainerreplicator',
		layout: 'anchor',
		listeners: {
			resetFields: 'onResetFields',
			loadData: 'onLoadData',
			putData: 'onPutData',
			putFields: 'onPutFields',
			removeFields: 'onRemoveFields'
		},

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: f5425391-da0f-102b-ad52-84a7b9a81fa0',
			number: 'Номер'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'anchor',
					anchor: '100%',
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: 'sequence',
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
						}
					},
					getValues: function ()
					{
						var me = this,
							itemInner = me.items.getAt(1),
							values;

						values = {
							_id: me.down('[name=sequence-id]').getValue(),
							_number: me.down('[name=sequence-number]').getValue(),
							title: me.down('[name=sequence-title]').getValues()
						};
						if (itemInner)
						{
							values.sequence = itemInner.getValues();
						}
						values = me.removeEmptyValues(values);

						return values;
					},
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							anchor: '100%',
							defaults: {
								anchor: '100%'
							},
							items: [
								{
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelWidth: 80,
										labelAlign: 'right',
										xtype: 'textfield'
									},
									items: [
										{
											xtype: 'textfieldclear',
											fieldLabel: me.translateText.id,
											name: 'sequence-id',
											allowBlank: false,
											regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
											regexText: me.translateText.idError
										},
										{
											xtype: 'numberfield',
											name: 'sequence-number',
											fieldLabel: me.translateText.number,
											cls: 'field-optional'
										}
									]
								},
								{
									xtype: 'fieldcontainer',
									width: 10
								},
								{
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									items: [
										{
											xtype: 'form-desc-title',
											name: 'sequence-title',
											layout: 'anchor',
											defaults: {
												anchor: '100%',
												labelWidth: 160,
												labelAlign: 'right'
											}
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

		getValues: function (d)
		{
			var me = this,
				data = d,
				items = me.items,
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
				data.sequence = values;
			}

			return data;
		}
	}
);