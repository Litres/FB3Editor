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

		translateText: {
			id: 'ID объекта',
			idError: 'Значение должно соответствовать шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			link: 'Тип связи',
			title: 'Общепринятое наименование',
			desc: 'Написание'
		},

		initComponent: function ()
		{
			var me = this,
				fieldStyleAllow = me.fieldDefaults.fieldStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

			me.items = [
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
							width: 280
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
							name: 'relations-object-id',
							allowBlank: false,
							regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
							regexText: me.translateText.idError
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
							fieldLabel: me.translateText.desc,
							name: 'relations-object-desc',
							allowBlank: true
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);