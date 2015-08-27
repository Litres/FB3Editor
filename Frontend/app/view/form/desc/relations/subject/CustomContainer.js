/**
 * Контейнер данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.CustomContainer',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.Link'
		],
		xtype: 'form-desc-relations-subject-container-custom',
		layout: 'anchor',
		flex: 1,

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			firstName: 'Имя',
			middleName: 'Отчество (второе имя)',
			lastName: 'Фамилия',
			titleMain: 'Стандартное написание',
			titleAlt: 'Альтернативное написание',
			desc: 'Написание'
		},

		initComponent: function ()
		{
			var me = this;

			me.hidden = FBEditor.accessHub;
			me.hidden = FBEditor.desc.Manager.loadingProcess ? false : me.hidden;

			me.items = [
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
									xtype: 'textfieldclear',
									fieldLabel: me.translateText.id,
									name: 'relations-subject-id',
									allowBlank: false,
									//editable: false,
									regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
									regexText: me.translateText.idError
								},
								{
									xtype: 'textfield',
									//allowBlank: false,
									//cls: 'field-required',
									fieldLabel: me.translateText.lastName,
									name: 'relations-subject-last-name'
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
									cls: 'relations-subject-title',
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
			];

			me.callParent(arguments);
		}
	}
);