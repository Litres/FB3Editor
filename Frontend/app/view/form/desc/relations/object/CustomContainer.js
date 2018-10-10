/**
 * Контейнер данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.CustomContainer',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.object.CustomContainerController',
			'FBEditor.view.form.desc.relations.object.Link'
		],

		controller: 'form.desc.relations.object.container.custom',
		xtype: 'form-desc-relations-object-container-custom',

		layout: 'anchor',
		flex: 1,

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			link: 'Тип связи',
			desc: 'Написание',
			pageEditor: 'Страница редактирования'
		},

		initComponent: function ()
		{
			var me = this;

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
								labelWidth: 100,
								labelAlign: 'right',
								xtype: 'textfield',
								keyEnterAsTab: true
							},
							items: [
								{
									xtype: 'form-desc-field-link-uuid',
									fieldLabel: me.translateText.id,
									name: 'relations-object-id',
									listeners: {
										afterrender: function ()
										{
											me.setObjectId(this);
										}
									}
								},
								{
									xtype: 'form-desc-relations-object-link',
									cls: 'field-required'
								},
								{
									fieldLabel: me.translateText.desc,
									name: 'relations-object-description',
									cls: 'field-optional',
									plugins: 'fieldCleaner'
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
									name: 'relations-object-title',
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

			isValid = val && (val._link || val.title && val.title.main) ? me.callParent(arguments) : true;

			return isValid;
		},

		getValue: function ()
		{
			var me = this,
				val;

			val = {
				_id: me.down('[name=relations-object-id]').getValue(),
				_link: me.down('form-desc-relations-object-link').getValue(),
				title: me.down('[name=relations-object-title]').getValues(),
				description: me.down('[name=relations-object-description]').getValue()
			};
			
			val = me.removeEmptyValues(val);

			return val;
		},
		
		/**
		 * Устанавливает id в поле.
		 * @param {FBEditor.view.form.desc.field.link.uuid.Link} cmp Поле ID.
		 */
		setObjectId: function (cmp)
		{
			var me = this,
				data = {},
				objectId = cmp,
				manager = FBEditor.desc.Manager,
				id;
			
			// получаем id
			id = objectId.getValue();
			
			if (!id)
			{
				id = manager.getNewId();
				data['relations-object-id'] = id;
				
				// обновляем ссылку id
				me.updateData(data);
			}
		}
	}
);