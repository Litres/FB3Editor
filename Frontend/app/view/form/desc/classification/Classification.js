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
			'FBEditor.view.form.desc.classification.target.Target',
			'FBEditor.view.form.desc.classification.setting.Setting',
			'FBEditor.view.form.desc.written.Written'
		],
		xtype: 'form-desc-classification',

		translateText: {
			info: 'Общая информация',
			bookClass: 'Литературная форма',
			contents: 'Тип лит. формы',
			target: 'Целевая аудитория',
			setting: 'Привязка к месту и времени',
			codes: 'Коды',
			udc: 'Код УДК',
			bbk: 'Код ББК',
			udcError: 'По шаблону [\\d\\. \\-\\*\\(\\)\\[\\]\\+:«»\'/A-Яа-я]+',
			bbkError: 'По шаблону [\\(\\)=\\d\\.\\-A-Яа-я/\\+ ]+',
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
											fieldLabel: me.translateText.bookClass,
											cls: 'field-optional'
										},
										{
											xtype: 'hiddenfield',
											name: 'classification-class-contents',
											value: 'standalone',
											fieldLabel: me.translateText.contents
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
					title: me.translateText.setting,
					items: [
						{
							xtype: 'form-desc-classification-setting'
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
							id: 'form-desc-classification-udc',
							flex: 1,
							layout: 'anchor',
							items: [
								{
									xtype: 'desc-fieldcontainer',
									layout: 'hbox',
									anchor: '100%',
									defaults: {
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 100,
										cls: 'field-optional'
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
											xtype: 'textfieldclear',
											name: 'classification-udc',
											flex: 1,
											fieldLabel: me.translateText.udc,
											regex: /^[\d\. \-\*\(\)\[\]\+:«»'/A-Яа-я]+$/,
											regexText: me.translateText.udcError,
											afterBodyEl:  '<span class="after-body">' + me.translateText.udcError +
											              '</span>'
										}
									]
								}

							]
						},
						{
							xtype: 'fieldcontainer',
							width: 10
						},
						{
							xtype: 'desc-fieldcontainer',
							name: 'form-desc-plugin-fieldcontainerreplicator',
							id: 'form-desc-classification-bbk',
							flex: 1,
							layout: 'anchor',
							items: [
								{
									xtype: 'desc-fieldcontainer',
									layout: 'hbox',
									anchor: '100%',
									defaults: {
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 100,
										cls: 'field-optional'
									},
									plugins: {
										ptype: 'fieldcontainerreplicator',
										groupName: 'classification-bbk',
										btnStyle: {
											margin: '0 0 0 5px'
										}
									},
									items: [
										{
											xtype: 'textfieldclear',
											name: 'classification-bbk',
											flex: 1,
											fieldLabel: me.translateText.bbk,
											regex: /^[\(\)=\d\.\-A-Яа-я/\+ ]+$/,
											regexText: me.translateText.bbkError,
											afterBodyEl:  '<span class="after-body">' + me.translateText.bbkError +
											              '</span>'
										}
									]
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
				}/*,
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
				}*/

			];
			me.callParent(arguments);
		},

		getValues: function (d)
		{
			var me = this,
				data = d,
				keywords,
				values;

			values = {
				subject: me.getDataFields(me.query('[name=classification-subject]')),
				'class': {
					_contents: me.down('[name=classification-class-contents]').getValue(),
					__text: me.down('form-desc-bookClass').getValue()
				},
				'target-audience': me.down('form-desc-classification-target').getValues(),
				setting: me.down('form-desc-classification-setting').getValues(),
				udc: me.getDataFields(me.query('[name=classification-udc]')),
				bbk: me.getDataFields(me.query('[name=classification-bbk]'))
			};
			data['fb3-classification'] = me.removeEmptyValues(values);
			data = me.down('form-desc-written').getValues(data);
			/*keywords = me.down('[name=keywords]').getValue();
			if (keywords)
			{
				data.keywords = keywords;
			}*/

			return data;
		}
	}
);