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
			'Ext.ux.FieldReplicator',
			'FBEditor.ux.FieldContainerReplicator'
		],
		id: 'window-desc-form',
		xtype: 'window-desc-form',
		bodyPadding: 5,
		defaults: {
			anchor: '100%'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'fieldset',
					title: 'Название произведения',
					collapsible: true,
					padding: '2',
					defaults: {
						xtype: 'textfield',
						anchor: '100%',
						labelWidth: 200,
						labelAlign: 'right',
						msgTarget: 'side',
						margin: '0 0 2 0'
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
					padding: '2',
					items: [
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							hideLabel: true,
							margin: '0 0 0 0',
							defaults: {
								anchor: '100%',
								flex: 1,
								xtype: 'displayfield',
								hideLabel: true,
								margin: '0 2 0 0',
								fieldStyle: 'top: 15px'
							},
							items: [
								{
									value: 'ID:'
								},
								{
									value: 'Тип связи:'
								},
								{
									value: 'Общепринятое наименование:'
								},
								{
									value: 'Первое имя:'
								},
								{
									value: 'Второе имя:'
								},
								{
									value: 'Последнее имя:'
								},
								{
									flex: 0,
									width: 140,
									value: ''
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							plugins: {
								ptype: 'fieldcontainerreplicator',
								groupName: 'subject',
								btnPos: 'end',
								btnStyle: 'margin: 0 0 0 2px'
							},
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
							items: [
								{
									name: 'subjectId',
									allowBlank: false
								},
								{
									name: 'subjectLink',
									allowBlank: false
								},
								{
									name: 'subjectTitle',
									allowBlank: false
								},
								{
									name: 'subjectFirstName',
									allowBlank: true
								},
								{
									name: 'subjectMiddleName',
									allowBlank: true
								},
								{
									name: 'subjectLastName',
									allowBlank: false
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