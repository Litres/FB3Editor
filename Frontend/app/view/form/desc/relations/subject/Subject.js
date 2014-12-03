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
			id: 'ID субъекта',
			idError: 'Значение должно соответствовать шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			link: 'Тип связи',
			firstName: 'Имя',
			middleName: 'Отчество (второе имя)',
			lastName: 'Фамилия',
			desc: 'Написание',
			titleMain: 'Полное имя'
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
						btnStyle: {
							margin: '0 0 0 5px',
							width: '40px',
							height: '65px'
						}
					},
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
									xtype: 'hiddenfield',
									fieldLabel: me.translateText.id,
									name: 'relations-subject-id',
									allowBlank: false,
									regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
									regexText: me.translateText.idError
								},
								{
									xtype: 'textfieldrequire',
									fieldLabel: me.translateText.lastName,
									name: 'relations-subject-last-name'
								},
								{
									xtype: 'form-desc-relations-subject-link'
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
								},
								{
									fieldLabel: me.translateText.desc,
									name: 'relations-subject-description',
									cls: 'field-optional'
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							width: 50
						},
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							items: [
								{
									xtype: 'textfieldrequire',
									name: 'relations-subject-title-main',
									anchor: '100%',
									labelWidth: 150,
									labelAlign: 'right',
									fieldLabel: me.translateText.titleMain
								}
							]
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);