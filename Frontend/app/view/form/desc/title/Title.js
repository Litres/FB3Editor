/**
 * Стандартный формат заголовка, включает обязательный главный заголовок,
 * опциональный подзаголовок и альтернативное название.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.title.Title',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-title',

		translateText: {
			main: 'Основное название',
			sub: 'Подзаголовок',
			alt: 'Альтернативное название'
		},

		initComponent: function ()
		{
			var me = this,
				name = me.name;

			me.items = [
				{
					xtype: 'textfieldclear',
					allowBlank: false,
					name: name + '-main',
					fieldLabel: me.translateText.main
				},
				{
					xtype: 'textfield',
					name: name + '-sub',
					cls: 'field-optional',
					fieldLabel: me.translateText.sub
				},
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					defaults: {
						anchor: '100%',
						flex: 1,
						labelWidth: 160,
						labelAlign: 'right'
					},
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: name + '-alt',
						btnStyle: {
							margin: '0 0 0 5px'
						}
					},
					items: [
						{
							xtype: 'textfield',
							name: name + '-alt',
							fieldLabel: me.translateText.alt,
							cls: 'field-optional'
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);