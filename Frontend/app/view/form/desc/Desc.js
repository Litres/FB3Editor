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
		bodyPadding: 0,
		defaults: {
			xtype: 'fieldset',
			collapsible: true,
			padding: '2',
			anchor: '100%'
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

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					title: me.translateText.periodical,
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
					title: me.translateText.title,
					items: [
						{
							xtype: 'form-desc-title',
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 200,
								labelAlign: 'right',
								msgTarget: 'side',
								margin: '0 0 2 0'
							}
						}
					]
				},
				{
					title: me.translateText.relations,
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
					title: me.translateText.classification,
					items: [
						{
							xtype: 'form-desc-classification',
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 200,
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
					fieldLabel: me.translateText.lang,
					allowBlank: false,
					forceSelection: true,
					labelWidth: 200,
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
					title: me.translateText.documentInfo,
					items: [
						{
							xtype: 'form-desc-documentInfo',
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 200,
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
					labelWidth: 200,
					labelAlign: 'right',
					msgTarget: 'side',
					style: {
						paddingBottom: '5px'
					}
				},
				{
					title: me.translateText.publishInfo,
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
					title: me.translateText.customInfo,
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