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
		items: [
			{
				xtype: 'textfield',
				name: 'title-main',
				fieldLabel: 'Основная часть',
				allowBlank: false
			},
			{
				xtype: 'textfield',
				name: 'title-sub',
				fieldLabel: 'Подзаголовок',
				allowBlank: true
			},
			{
				xtype: 'textfield',
				name: 'title-alt',
				fieldLabel: 'Альтернативное название',
				allowBlank: true,
				plugins: 'fieldreplicator'
			}
		]
	}
);