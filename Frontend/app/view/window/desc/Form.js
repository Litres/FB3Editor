/**
 * Форма описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.desc.Form',
	{
		extend: 'Ext.form.Panel',
		requires: [
			'Ext.ux.FieldReplicator'
		],
		id: 'window-desc-form',
		xtype: 'window-desc-form',
		bodyPadding: 5,
		defaults: {
			anchor: '100%',
			labelWidth: 100
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'fieldset',
					title: 'Название произведения',
					collapsible: true,
					defaults: {
						labelWidth: 200,
						xtype: 'textfield',
						anchor: '100%',
						msgTarget: 'under'
					},
					items: [
						{
							name: 'titleMain',
							fieldLabel: 'Основная часть',
							allowBlank: false
						},
						{
							name: 'titleSub',
							fieldLabel: 'Подзаголовок',
							allowBlank: true
						},
						{
							name: 'titleAlt',
							fieldLabel: 'Альтернативное название',
							allowBlank: true
						}
					]
				},
				{
					xtype: 'fieldset',
					title: 'Авторы, правообладатели и другие имеющие отношение к произведению субьекты',
					collapsible: true,
					plugins: 'fieldreplicator',
					defaults: {
						labelWidth: 200,
						xtype: 'textfield',
						anchor: '100%',
						msgTarget: 'under'
					},
					items: [
						{
							name: 'subjectTitle',
							fieldLabel: 'Общепринятое наименование',
							allowBlank: false
						},
						{
							name: 'subjectFirstName',
							fieldLabel: 'Первое имя',
							allowBlank: true
						},
						{
							name: 'subjectMiddleName',
							fieldLabel: 'Второе имя',
							allowBlank: true
						},
						{
							name: 'subjectLastName',
							fieldLabel: 'Последнее имя',
							allowBlank: false
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);