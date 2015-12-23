/**
 * Информация о файле.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.documentInfo.DocumentInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.documentInfo.editor.Editor',
			'FBEditor.view.form.desc.documentInfo.isbn.Isbn'
		],
		xtype: 'form-desc-documentInfo',
		id: 'form-desc-documentInfo',

		translateText: {
			created: 'Файл создан',
			date: 'Дата',
			time: 'Время',
			updated: 'Последнее изменение',
			otherInfo: 'Прочая информация',
			programUsed: 'Программа',
			srcUrl: 'URL',
			ocr: 'OCR',
			editor: 'Редактор',
			isbn: 'ISBN'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.created,
					require: true,
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
										labelWidth: 160,
										keyEnterAsTab: true
									},
									items: [
										{
											xtype: 'desc-date',
											allowBlank: false,
											name: 'document-info-created-date',
											value: new Date(),
											fieldLabel: me.translateText.date,
											cls: 'field-required'
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
									defaults: {
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 110,
										keyEnterAsTab: true
									},
									items: [
										{
											xtype: 'timefield',
											allowBlank: false,
											name: 'document-info-created-time',
											value: new Date(),
											format: 'H:i:s',
											fieldLabel: me.translateText.time,
											cls: 'field-required'
										}
									]
								}
							]
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.updated,
					require: true,
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
										labelWidth: 160,
										keyEnterAsTab: true
									},
									items: [
										{
											xtype: 'displayfield',
											//allowBlank: false,
											name: 'document-info-updated-date',
											//disabled: true,
											fieldLabel: me.translateText.date/*,
											cls: 'field-required'*/
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
									defaults: {
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 110,
										keyEnterAsTab: true
									},
									items: [
										{
											xtype: 'displayfield',
											//allowBlank: false,
											name: 'document-info-updated-time',
											format: 'H:i:s',
											//disabled: true,
											fieldLabel: me.translateText.time/*,
											cls: 'field-required'*/
										}
									]
								}
							]
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.otherInfo,
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
										cls: 'field-optional',
										keyEnterAsTab: true
									},
									items: [
										{
											xtype: 'displayfield',
											name: 'document-info-program-used',
											fieldLabel: me.translateText.programUsed,
											value: 'FB3Editor'
										},
										{
											xtype: 'form-desc-documentInfo-editor',
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
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										xtype: 'textfield',
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 110,
										cls: 'field-optional',
										keyEnterAsTab: true
									},
									items: [
										{
											xtype: 'textfieldclear',
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
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.isbn,
					items: [
						{
							xtype: 'form-desc-documentInfo-isbn',
							fieldName: 'document-info-isbn'
						}
					]
				}
			];
			me.callParent(arguments);
		},

		getValues: function (d)
		{
			var me = this,
				data = d,
				created,
				updated,
				time,
				values,
				isbn;

			created = Ext.Date.format(me.down('[name=document-info-created-date]').getValue(), 'Y-m-d');
			time = Ext.Date.format(me.down('[name=document-info-created-time]').getValue(), 'H:i:s');
			created = created && time ? created + 'T' + time : null;

			// дата и время модификации формируются автоматически
			updated = Ext.Date.format(new Date(), 'Y-m-d');
			time = Ext.Date.format(new Date(), 'H:i:s');
			updated = updated && time ? updated + 'T' + time : null;

			isbn = me.down('form-desc-documentInfo-isbn').getValues();

			values = {
				_created: created,
				_updated: updated,
				'_program-used': me.down('[name=document-info-program-used]').getValue(),
				'_src-url': me.down('[name=document-info-src-url]').getValue(),
				_ocr: me.down('[name=document-info-ocr]').getValue(),
				_editor: me.down('[name=document-info-editor]').getValue(),
				isbn: isbn
			};
			data['document-info'] = me.removeEmptyValues(values);

			return data;
		}
	}
);