/**
 * Информация о файле.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.documentInfo.DocumentInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-documentInfo',

		translateText: {
			created: 'Файл создан',
			date: 'Дата',
			time: 'Время',
			updated: 'Последнее изменение',
			otherInfo: 'Прочая информация',
			programUsed: 'Программа',
			srcUrl: 'URL',
			ocr: 'OCR',
			editor: 'Редактор'
		},

		initComponent: function ()
		{
			var me = this,
				labelStyleAllow = me.fieldDefaults.labelStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

			me.items = [
				{
					xtype: 'fieldset',
					cls: 'fieldset-small',
					title: me.translateText.created,
					collapsible: true,
					anchor: '100%',
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 160
									},
									items: [
										{
											xtype: 'datefield',
											name: 'document-info-created-date',
											fieldLabel: me.translateText.date
										}
									]
								},
								{
									xtype: 'fieldcontainer',
									width: 50
								},
								{
									xtype: 'fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 110
									},
									items: [
										{
											xtype: 'timefield',
											name: 'document-info-created-time',
											format: 'H:i:s',
											fieldLabel: me.translateText.time
										}
									]
								}
							]
						}
					]
				},
				{
					xtype: 'fieldset',
					cls: 'fieldset-small',
					title: me.translateText.updated,
					collapsible: true,
					anchor: '100%',
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 160
									},
									items: [
										{
											xtype: 'datefield',
											name: 'document-info-updated-date',
											fieldLabel: me.translateText.date
										}
									]
								},
								{
									xtype: 'fieldcontainer',
									width: 50
								},
								{
									xtype: 'fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 110
									},
									items: [
										{
											xtype: 'timefield',
											name: 'document-info-updated-time',
											format: 'H:i:s',
											fieldLabel: me.translateText.time
										}
									]
								}
							]
						}
					]
				},
				{
					xtype: 'fieldset',
					cls: 'fieldset-small optional',
					title: me.translateText.otherInfo,
					collapsible: true,
					collapsed: true,
					anchor: '100%',
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										xtype: 'textfield',
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 160,
										labelStyle: labelStyleAllow
									},
									items: [
										{
											name: 'document-info-program-used',
											fieldLabel: me.translateText.programUsed
										},
										{
											name: 'document-info-editor',
											fieldLabel: me.translateText.editor
										}
									]
								},
								{
									xtype: 'fieldcontainer',
									width: 50
								},
								{
									xtype: 'fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										xtype: 'textfield',
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 110,
										labelStyle: labelStyleAllow
									},
									items: [
										{
											vtype: 'url',
											name: 'document-info-src-url',
											fieldLabel: me.translateText.srcUrl
										},
										{
											name: 'document-info-ocr',
											fieldLabel: me.translateText.ocr
										}
									]
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