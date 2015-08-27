/**
 * Авторы, правообладатели и другие имеющие отношение к произведению субьекты.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.Subject',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.SearchContainer',
			'FBEditor.view.form.desc.relations.subject.CustomContainer'
		],
		id: 'form-desc-relations-subject',
		xtype: 'form-desc-relations-subject',
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
						groupName: 'subject',
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
							btn = this.down('form-desc-relations-subject-customBtn');
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
									xtype: 'form-desc-relations-subject-container-custom'
								},
								{
									xtype: 'form-desc-relations-subject-container-search'
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
				items = me.items,
				data = d,
				values = null;

			items.each(
				function (item)
				{
					var val;

					val = {
						_id: item.down('[name=relations-subject-id]').getValue(),
						_link: item.down('form-desc-relations-subject-link').getValue(),
						'last-name': item.down('[name=relations-subject-last-name]').getValue(),
						'first-name': item.down('[name=relations-subject-first-name]').getValue(),
						'middle-name': item.down('[name=relations-subject-middle-name]').getValue(),
						title: item.down('[name=relations-subject-title]').getValues()
					};
					val = me.removeEmptyValues(val);
					if (val)
					{
						val._id = val._id ? val._id : '';
						values = values || [];
						values.push(val);
					}
				}
			);
			data['fb3-relations'] = data['fb3-relations'] || {};
			data['fb3-relations'].subject = values;

			return data;
		}
	}
);