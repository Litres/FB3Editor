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
			'FBEditor.view.form.desc.relations.object.Link'
		],
		xtype: 'form-desc-relations-object',
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
						value: 'ID объекта:'
					},
					{
						value: 'Тип связи:'
					},
					{
						value: 'Общепринятое наименование:',
						flex: 0,
						width: 280
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
						name: 'relations-object-id',
						allowBlank: false
					},
					{
						xtype: 'form-desc-relations-object-link'
					},
					{
						xtype: 'form-desc-title',
						flex: 0,
						width: 280,
						layout: 'fit',
						defaults: {
							labelWidth: 140,
							labelAlign: 'right',
							margin: '0 0 2 0'
						}
					},
					{
						fieldLabel: 'Написание',
						name: 'relations-object-desc',
						allowBlank: true
					}
				]
			}
		]
	}
);