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
			'FBEditor.view.form.desc.relations.subject.Link'
		],
		id: 'form-desc-relations-subject',
		xtype: 'form-desc-relations-subject',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			firstName: 'Имя',
			middleName: 'Отчество (второе имя)',
			lastName: 'Фамилия',
			desc: 'Написание',
			titleMain: 'Стандартное написание',
			titleAlt: 'Альтернативное написание'
		},

		initComponent: function ()
		{
			var me = this;

			me.items=  [
				{
					xtype: 'desc-fieldcontainer',
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
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'anchor',
							flex: 1,
							items: [
								{
									xtype: 'desc-fieldcontainer',
									layout: 'hbox',
									items: [
										{
											xtype: 'desc-fieldcontainer',
											flex: 1,
											layout: 'anchor',
											defaults: {
												anchor: '100%',
												labelWidth: 160,
												labelAlign: 'right',
												xtype: 'textfield'
											},
											items: [
												{
													xtype: 'displayfield',
													fieldLabel: me.translateText.id,
													name: 'relations-subject-id',
													allowBlank: false,
													editable: false,
													regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
													regexText: me.translateText.idError
												},
												{
													xtype: 'textfieldclear',
													allowBlank: false,
													fieldLabel: me.translateText.lastName,
													name: 'relations-subject-last-name',
													cls: 'field-required'
												},
												{
													fieldLabel: me.translateText.firstName,
													name: 'relations-subject-first-name',
													cls: 'field-optional'
												},
												{
													fieldLabel: me.translateText.middleName,
													name: 'relations-subject-middle-name',
													cls: 'field-optional'
												}/*,
												 {
												 fieldLabel: me.translateText.desc,
												 name: 'relations-subject-description',
												 cls: 'field-optional'
												 }*/
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
													name: 'relations-subject-title',
													layout: 'anchor',
													enableSub: false,
													translateText: {
														main: me.translateText.titleMain,
														alt: me.translateText.titleAlt
													},
													defaults: {
														anchor: '100%',
														labelWidth: 160,
														labelAlign: 'right'
													}
												}
											]
										}
									]
								},
								{
									xtype: 'form-desc-relations-subject-link',
									labelWidth: 160,
									labelAlign: 'right',
									cls: 'field-required'
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