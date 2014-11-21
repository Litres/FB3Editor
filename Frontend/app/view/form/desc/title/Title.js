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
			main: 'Основная часть',
			sub: 'Подзаголовок',
			alt: 'Альтернативное название'
		},

		initComponent: function ()
		{
			var me = this,
				name = me.name,
				labelStyleAllow = me.fieldDefaults.labelStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

			me.items = [
				{
					xtype: 'textfield',
					name: name + '-main',
					fieldLabel: me.translateText.main,
					allowBlank: false
				},
				{
					xtype: 'textfield',
					name: name + '-sub',
					fieldLabel: me.translateText.sub,
					labelStyle: labelStyleAllow
				},
				{
					xtype: 'textfield',
					name: name + '-alt',
					fieldLabel: me.translateText.alt,
					labelStyle: labelStyleAllow,
					plugins: 'fieldreplicator',
					cls: 'plugin-fieldreplicator'
				}
			];
			me.callParent(arguments);
		}
	}
);