/**
 * Форма описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.Desc',
	{
		extend: 'Ext.form.Panel',
		requires: [
			'FBEditor.view.form.desc.AbstractFieldContainer',
			'Ext.ux.FieldReplicator',
			'FBEditor.ux.FieldContainerReplicator',
			'FBEditor.view.field.country.Country',
			'FBEditor.view.field.lang.Lang',
			'FBEditor.view.field.datetime.Datetime',
			'FBEditor.view.form.desc.periodical.Periodical',
			'FBEditor.view.form.desc.title.Title',
			'FBEditor.view.form.desc.bookClass.BookClass',
			'FBEditor.view.form.desc.subject.Subject',
			'FBEditor.view.form.desc.relations.Relations',
			'FBEditor.view.form.desc.classification.Classification',
			'FBEditor.view.form.desc.written.Written',
			'FBEditor.view.form.desc.documentInfo.DocumentInfo',
			'FBEditor.view.form.desc.publishInfo.PublishInfo',
			'FBEditor.view.form.desc.customInfo.CustomInfo'
		],
		id: 'form-desc',
		xtype: 'form-desc',
		autoScroll: true,
		minWidth: 800,
		bodyPadding: 0,
		defaults: {
			xtype: 'fieldset',
			collapsible: true,
			padding: '2',
			anchor: '100%'
		},
		fieldDefaults: {
			labelStyle: 'font-size: 10px; line-height: 1',
			fieldStyle: 'font-size: 10px; line-height: 1'
		},

		translateText: {
			periodical: 'Периодическое издание',
			title: 'Название произведения',
			relations: 'Все связанные с данным документом персоны и объекты',
			classification: 'Классификация произведения',
			lang: 'Язык',
			documentInfo: 'Информация о файле',
			keywords: 'Ключевые слова',
			publishInfo: 'Информация о бумажной публикации',
			customInfo: 'Пользовательская информация'
		},

		titleTpl: '<span style="font-size: 12px">{%s}</span>',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					title: me.titleTpl.replace('{%s}', me.translateText.periodical),
					collapsed: true,
					items: [
						{
							xtype: 'form-desc-periodical',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				},
				{
					title: me.titleTpl.replace('{%s}', '* ' + me.translateText.title),
					items: [
						{
							xtype: 'form-desc-title',
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 140,
								labelAlign: 'right',
								msgTarget: 'side',
								margin: '0 0 2 0'
							}
						}
					]
				},
				{
					title: me.titleTpl.replace('{%s}', '* ' + me.translateText.relations),
					items: [
						{
							xtype: 'form-desc-relations',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				},
				{
					title: me.titleTpl.replace('{%s}', '* ' + me.translateText.classification),
					items: [
						{
							xtype: 'form-desc-classification',
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 140,
								labelAlign: 'right',
								msgTarget: 'side',
								margin: '0 0 2 0'
							}
						}
					]
				},
				{
					xtype: 'langfield',
					name: 'lang',
					fieldLabel: '* ' + me.translateText.lang,
					allowBlank: false,
					forceSelection: true,
					labelWidth: 140,
					labelAlign: 'right',
					msgTarget: 'side',
					style: {
						paddingBottom: '5px'
					}
				},
				{
					xtype: 'form-desc-written'
				},
				{
					title: me.titleTpl.replace('{%s}', '* ' + me.translateText.documentInfo),
					items: [
						{
							xtype: 'form-desc-documentInfo',
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 140,
								labelAlign: 'right',
								msgTarget: 'side',
								margin: '0 0 2 0'
							}
						}
					]
				},
				{
					xtype: 'textfield',
					name: 'keywords',
					fieldLabel: me.translateText.keywords,
					labelWidth: 140,
					labelAlign: 'right',
					msgTarget: 'side',
					style: {
						paddingBottom: '5px'
					}
				},
				{
					title: me.titleTpl.replace('{%s}', me.translateText.publishInfo),
					collapsed: true,
					items: [
						{
							xtype: 'form-desc-publishInfo',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				},
				{
					title: me.titleTpl.replace('{%s}', me.translateText.customInfo),
					collapsed: true,
					items: [
						{
							xtype: 'form-desc-customInfo',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);