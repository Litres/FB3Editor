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
		id: 'form-desc-relations-object',
		xtype: 'form-desc-relations-object',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		translateText: {
			id: 'ID',
			idError: 'Значение должно соответствовать шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			link: 'Тип связи',
			desc: 'Написание'
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
						groupName: 'object',
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
									xtype: 'textfieldclear',
									fieldLabel: me.translateText.id,
									name: 'relations-object-id',
									allowBlank: false,
									regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
									regexText: me.translateText.idError
								},
								{
									xtype: 'form-desc-relations-object-link'
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
							width: 50
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