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
		items: [
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
						value: 'ID субъекта:'
					},
					{
						value: 'Тип связи:'
					},
					{
						value: 'Общепринятое наименование:',
						flex: 0,
						width: 210
					},
					{
						value: 'Имя:'
					},
					{
						value: 'Отчество (второе имя):'
					},
					{
						value: 'Фамилия:'
					},
					{
						value: 'Написание:'
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
						fieldLabel: 'ID',
						name: 'relations-subject-id',
						allowBlank: false
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
						fieldLabel: 'Имя',
						name: 'relations-subject-firstName',
						allowBlank: true
					},
					{
						fieldLabel: 'Отчество (второе имя)',
						name: 'relations-subject-middleName',
						allowBlank: true
					},
					{
						fieldLabel: 'Фамилия',
						name: 'relations-subject-lastName',
						allowBlank: false
					},
					{
						fieldLabel: 'Написание',
						name: 'relations-subject-desc',
						allowBlank: true
					}
				]
			}
		]
	}
);