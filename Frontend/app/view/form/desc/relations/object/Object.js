/**
 * Объекты имеющие отношение к произведению.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.Object',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.object.SearchContainer',
			'FBEditor.view.form.desc.relations.object.CustomContainer'
		],
		id: 'form-desc-relations-object',
		xtype: 'form-desc-relations-object',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		initComponent: function ()
		{
			var me = this;

			me.items=  [
				{
					xtype: 'desc-fieldcontainer',
					cls: 'desc-fieldcontainer',
					layout: 'hbox',
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: 'object',
						btnPos: 'end',
						btnCls: 'plugin-fieldcontainerreplicator-big-btn',
						btnStyle: {
							margin: '0 0 0 5px',
							width: '40px',
							height: '65px'
						}
					},
					listeners: {
						resetContainer: function ()
						{
							var btn;

							// скрываем поля поиска, показываем поля данных
							btn = this.down('form-desc-relations-object-customBtn');
							btn.handler();
						}
					},
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'anchor',
							flex: 1,
							items: [
								{
									xtype: 'form-desc-relations-object-container-custom'
								},
								{
									xtype: 'form-desc-relations-object-container-search'
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
			var me = this;

			return me.getValid('fb3-relations');
		},

		getValues: function (d)
		{
			var me = this,
				items = me.items,
				data = d,
				values = null;

			items.each(
				function (item)
				{
					var val;

					val = {
						_id: item.down('[name=relations-object-id]').getValue(),
						_link: item.down('form-desc-relations-object-link').getValue()
					};
					val = me.removeEmptyValues(val);
					if (val)
					{
						val.description = item.down('[name=relations-object-description]').getValue();
						val.title = item.down('[name=relations-object-title]').getValues();
						val = me.removeEmptyValues(val);
						values = values || [];
						values.push(val);
					}
				}
			);
			if (values)
			{
				data['fb3-relations'] = data['fb3-relations'] || {};
				data['fb3-relations'].object = values;
			}

			return data;
		}
	}
);