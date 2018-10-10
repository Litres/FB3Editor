/**
 * Контейнер данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.CustomContainer',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-sequence-container-custom',

		layout: 'anchor',
		flex: 1,

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			number: 'Номер'
		},

		initComponent: function ()
		{
			var me = this;

			me.hidden = FBEditor.accessHub;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					cls: 'block-container', // необходим для выделения блока полей
					items: [
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 80,
								labelAlign: 'right',
								xtype: 'textfield',
								keyEnterAsTab: true
							},
							items: [
								{
									xtype: 'form-desc-field-link-uuid',
									fieldLabel: me.translateText.id,
									name: 'sequence-id',
									listeners: {
										afterrender: function ()
										{
											me.setSequenceId(this);
										}
									}
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
			];

			me.callParent(arguments);
		},

		isValid: function ()
		{
			var me = this,
				val = me.getValue(),
				isValid;

			isValid = val && (val.title || val._number) ? me.callParent(arguments) : true;

			return isValid;
		},

		getValue: function ()
		{
			var me = this,
				val;

			val = {
				_id: me.down('[name=sequence-id]').getValue(),
				_number: me.down('[name=sequence-number]').getValue(),
				title: me.down('[name=sequence-title]').getValues()
			};

			return val;
		},
		
		/**
		 * Устанавливает id в поле.
		 * @param {FBEditor.view.form.desc.field.link.uuid.Link} cmp Поле ID.
		 */
		setSequenceId: function (cmp)
		{
			var me = this,
				data = {},
				sequenceId = cmp,
				manager = FBEditor.desc.Manager,
				id;
			
			// получаем id
			id = sequenceId.getValue();
			
			if (!id)
			{
				id = manager.getNewId();
				data['sequence-id'] = id;
				
				// обновляем ссылку id
				me.updateData(data);
			}
		}
	}
);