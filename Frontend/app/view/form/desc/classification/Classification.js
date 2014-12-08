/**
 * Набор полей, описывающий положение в каталоге для произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.Classification',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.bookClass.BookClass',
			'FBEditor.view.form.desc.subject.Subject',
			'FBEditor.view.form.desc.classification.class.Contents',
			//'FBEditor.view.form.desc.classification.customSubject.CustomSubject',
			'FBEditor.view.form.desc.classification.target.Target',
			'FBEditor.view.form.desc.classification.coverage.Coverage',
			'FBEditor.view.form.desc.written.Written'
		],
		xtype: 'form-desc-classification',

		translateText: {
			info: 'Общая информация',
			bookClass: 'Литературная форма',
			contents: 'Тип лит. формы',
			target: 'Целевая аудитория',
			coverage: 'Привязка к месту и времени',
			codes: 'Коды',
			udk: 'Код УДК',
			bbk: 'Код ББК',
			udkError: 'По шаблону \d+(\.\d+)+(:\d+)?. Например 373.167.1:58',
			bbkError: 'По шаблону \d+([\.а-я]\d+)+. Например 28.5я72',
			written: 'Дата и место написания',
			keywords: 'Ключевые слова',
			keywordsHelp: 'Перечислите через запятую. Например 1912, война, роман, отечественная, наполеон, кутузов'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.info,
					require: true,
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'desc-fieldcontainer',
									name: 'form-desc-plugin-fieldcontainerreplicator',
									id: 'classification-custom-subject',
									flex: 1,
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 160
									},
									items: [
										{
											xtype: 'form-desc-bookClass',
											name: 'classification-class-text',
											fieldLabel: me.translateText.bookClass
										},
										{
											xtype: 'hiddenfield',
											name: 'classification-class-contents',
											value: 'standalone',
											fieldLabel: me.translateText.contents
										}
										/*
										{
											xtype: 'form-desc-classification-class-contents',
											name: 'classification-class-contents',
											fieldLabel: me.translateText.contents
										}
										*/
										/*
										{
											xtype: 'classification-custom-subject'
										}
										*/
									]
								},
								{
									xtype: 'fieldcontainer',
									width: 50
								},
								{
									xtype: 'desc-fieldcontainer',
									name: 'form-desc-plugin-fieldcontainerreplicator',
									id: 'form-desc-subject',
									flex: 1,
									layout: 'anchor',
									defaults: {
										anchor: '100%'
									},
									items: [
										{
											xtype: 'form-desc-subject'
										}
									]
								}
							]
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.target,
					items: [
						{
							xtype: 'form-desc-classification-target'
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.coverage,
					items: [
						{
							xtype: 'form-desc-classification-coverage'
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					layout: 'hbox',
					title: me.translateText.codes,
					items: [
						{
							xtype: 'desc-fieldcontainer',
							name: 'form-desc-plugin-fieldcontainerreplicator',
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelAlign: 'right',
								labelWidth: 160,
								cls: 'field-optional'
							},
							items: [
								{
									xtype: 'textfieldclear',
									name: 'classification-udk',
									cls: 'plugin-fieldreplicator',
									fieldLabel: me.translateText.udk,
									regex: /^\d+(\.\d+)+(:\d+)?$/,
									regexText: me.translateText.udkError,
									afterBodyEl:  '<span class="after-body">' + me.translateText.udkError + '</span>',
									plugins: 'fieldreplicator'
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							width: 50
						},
						{
							xtype: 'desc-fieldcontainer',
							name: 'form-desc-plugin-fieldcontainerreplicator',
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelAlign: 'right',
								labelWidth: 120,
								cls: 'field-optional'
							},
							items: [
								{
									xtype: 'textfieldclear',
									name: 'classification-bbk',
									cls: 'plugin-fieldreplicator',
									fieldLabel: me.translateText.bbk,
									regex: /^\d+([\.а-я]\d+)+$/,
									regexText: me.translateText.bbkError,
									afterBodyEl:  '<span class="after-body">' + me.translateText.bbkError + '</span>',
									plugins: 'fieldreplicator'
								}
							]
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.written,
					require: true,
					items: [
						{
							xtype: 'form-desc-written'
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.keywords,
					items: [
						{
							xtype: 'textareafield',
							name: 'keywords',
							anchor: '100%',
							grow: true,
							growMin: 1,
							fieldLabel: ' ',
							labelSeparator: '',
							labelWidth: 160,
							afterBodyEl:  '<span class="after-body">' + me.translateText.keywordsHelp + '</span>'
						}
					]
				}

			];
			me.callParent(arguments);
		}
	}
);