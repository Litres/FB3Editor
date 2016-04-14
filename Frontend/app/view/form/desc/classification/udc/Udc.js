/**
 * Мультиполе - Код УДК.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.udc.Udc',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.classification.udc.field.Field'
		],

		xtype: 'form-desc-classification-udc',
		id: 'form-desc-classification-udc',

		name: 'form-desc-plugin-fieldcontainerreplicator',

		flex: 1,
		layout: 'anchor',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					anchor: '100%',
					defaults: {
						anchor: '100%',
						labelAlign: 'right',
						labelWidth: 100,
						cls: 'field-optional',
						keyEnterAsTab: true
					},
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: 'classification-udc',
						btnStyle: {
							margin: '0 0 0 5px'
						}
					},
					items: [
						{
							xtype: 'form-desc-classification-udc-field'
						}
					]
				}
			];

			me.callParent(arguments);
		}
	}
);