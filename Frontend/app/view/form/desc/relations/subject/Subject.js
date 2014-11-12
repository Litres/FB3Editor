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
		xtype: 'form-desc-relations-subject',

		translateText: {
			id: 'ID субъекта',
			idError: 'Значение должно соответствовать шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			link: 'Тип связи',
			title: 'Общепринятое наименование',
			firstName: 'Имя',
			middleName: 'Отчество (второе имя)',
			lastName: 'Фамилия',
			desc: 'Написание'
		},

		initComponent: function ()
		{
			var me = this,
				fieldStyleAllow = me.fieldDefaults.fieldStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

			me.items=  [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					hideLabel: true,
					margin: '0 0 0 0',
					defaults: {
						anchor: '100%',
						flex: 1,
						xtype: 'displayfield',
						hideLabel: true,
						margin: '0 2 0 0'
					},
					items: [
						{
							value: me.translateText.id + ':'
						},
						{
							value: me.translateText.link + ':'
						},
						{
							value: me.translateText.title + ':',
							flex: 0,
							width: 210
						},
						{
							value: me.translateText.firstName + ':',
							fieldStyle: fieldStyleAllow
						},
						{
							value: me.translateText.middleName + ':',
							fieldStyle: fieldStyleAllow
						},
						{
							value: me.translateText.lastName + ':'
						},
						{
							value: me.translateText.desc + ':',
							fieldStyle: fieldStyleAllow
						},
						{
							flex: 0,
							width: 140,
							value: ''
						}
					]
				},
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					hideLabel: true,
					combineErrors: true,
					msgTarget: 'side',
					defaults: {
						anchor: '100%',
						flex: 1,
						labelAlign: 'top',
						labelPad: '0',
						xtype: 'textfield',
						msgTarget: 'none',
						hideLabel: true,
						margin: '0 2 0 0'
					},
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: 'subject',
						btnPos: 'end',
						btnStyle: {
							margin: '0 0 0 2px'
						}
					},
					items: [
						{
							fieldLabel: me.translateText.id,
							name: 'relations-subject-id',
							allowBlank: false,
							regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
							regexText: me.translateText.idError
						},
						{
							xtype: 'form-desc-relations-subject-link'
						},
						{
							xtype: 'form-desc-title',
							flex: 0,
							width: 210,
							layout: 'fit',
							defaults: {
								labelWidth: 90,
								labelAlign: 'right',
								margin: '0 0 2 0'
							}
						},
						{
							fieldLabel: me.translateText.firstName,
							name: 'relations-subject-firstName'
						},
						{
							fieldLabel: me.translateText.middleName,
							name: 'relations-subject-middleName'
						},
						{
							fieldLabel: me.translateText.lastName,
							name: 'relations-subject-lastName',
							allowBlank: false
						},
						{
							fieldLabel: me.translateText.desc,
							name: 'relations-subject-desc'
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);