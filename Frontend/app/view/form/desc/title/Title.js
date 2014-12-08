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

		/**
		 * @property {Boolean} Необходимо ли показывать подзаголовок.
		 */
		enableSub: true,

		translateText: {
			main: 'Основное название',
			sub: 'Подзаголовок',
			alt: 'Альтернативное название'
		},

		initComponent: function ()
		{
			var me = this,
				name = me.name,
				items = [];

			items.push(
				{
					xtype: 'textfieldclear',
					allowBlank: false,
					name: name + '-main',
					fieldLabel: me.translateText.main
				}
			);
			if (me.enableSub)
			{
				items.push(
					{
						xtype: 'textfield',
						name: name + '-sub',
						cls: 'field-optional',
						fieldLabel: me.translateText.sub
					}
				);
			}
			items.push(
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
							margin: '3px 0 0 5px'
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
			);
			me.items = items;
			me.callParent(arguments);
		}
	}
);