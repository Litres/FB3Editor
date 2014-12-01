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
			'FBEditor.view.form.desc.classification.class.Contents',
			'FBEditor.view.form.desc.classification.customSubject.CustomSubject',
			'FBEditor.view.form.desc.classification.target.Target',
			'FBEditor.view.form.desc.classification.coverage.Coverage'
		],
		xtype: 'form-desc-classification',
		layout: 'anchor',

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
			var me = this,
				labelStyleAllow = me.fieldDefaults.labelStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

			me.items = [
				{
					xtype: 'fieldset',
					cls: 'fieldset-small',
					title: me.translateText.info,
					collapsible: true,
					anchor: '100%',
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
											xtype: 'form-desc-classification-class-contents',
											name: 'classification-class-contents',
											fieldLabel: me.translateText.contents
										}/*,
										{
											xtype: 'classification-custom-subject'
										}*/
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
					xtype: 'fieldset',
					cls: 'fieldset-small optional',
					title: me.translateText.target,
					collapsible: true,
					collapsed: true,
					anchor: '100%',
					items: [
						{
							xtype: 'form-desc-classification-target'
						}
					]
				},
				{
					xtype: 'fieldset',
					cls: 'fieldset-small optional',
					title: me.translateText.coverage,
					collapsible: true,
					collapsed: true,
					anchor: '100%',
					items: [
						{
							xtype: 'form-desc-classification-coverage'
						}
					]
				},
				{
					xtype: 'fieldset',
					layout: 'hbox',
					cls: 'fieldset-small optional',
					title: me.translateText.codes,
					collapsible: true,
					collapsed: true,
					anchor: '100%',
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
								labelStyle: labelStyleAllow
							},
							items: [
								{
									xtype: 'textfield',
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
								labelWidth: 110,
								labelStyle: labelStyleAllow
							},
							items: [
								{
									xtype: 'textfield',
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
					xtype: 'fieldset',
					cls: 'fieldset-small',
					title: me.translateText.written,
					collapsible: true,
					anchor: '100%',
					items: [
						{
							xtype: 'form-desc-written'
						}
					]
				},
				{
					xtype: 'fieldset',
					cls: 'fieldset-small optional',
					title: me.translateText.keywords,
					collapsible: true,
					collapsed: true,
					anchor: '100%',
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