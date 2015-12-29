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
			'FBEditor.view.form.desc.relations.object.Link'
		],
		xtype: 'form-desc-relations-object-container-custom',
		layout: 'anchor',
		flex: 1,

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			link: 'Тип связи',
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
									xtype: 'textfieldclear',
									fieldLabel: me.translateText.id,
									name: 'relations-object-id',
									allowBlank: false,
									regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
									regexText: me.translateText.idError,
									cls: 'field-required'
								},
								{
									xtype: 'form-desc-relations-object-link',
									cls: 'field-required'
								},
								{
									fieldLabel: me.translateText.desc,
									name: 'relations-object-description',
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
		}
	}
);