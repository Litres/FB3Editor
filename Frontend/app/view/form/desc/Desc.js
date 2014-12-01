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
			'FBEditor.view.form.desc.DescController',
			'FBEditor.view.form.desc.AbstractFieldContainer',
			'Ext.ux.FieldReplicator',
			'FBEditor.ux.FieldContainerReplicator',
			'FBEditor.view.field.country.Country',
			'FBEditor.view.field.lang.Lang',
			'FBEditor.view.field.datetime.Datetime',
			'FBEditor.view.field.textfieldrequire.TextFieldRequire',
			'FBEditor.view.form.desc.periodical.Periodical',
			'FBEditor.view.form.desc.title.Title',
			'FBEditor.view.form.desc.sequence.Sequence',
			'FBEditor.view.form.desc.bookClass.BookClass',
			'FBEditor.view.form.desc.subject.Subject',
			'FBEditor.view.form.desc.relations.subject.Subject',
			'FBEditor.view.form.desc.relations.object.Object',
			'FBEditor.view.form.desc.classification.Classification',
			'FBEditor.view.form.desc.written.Written',
			'FBEditor.view.form.desc.documentInfo.DocumentInfo',
			'FBEditor.view.form.desc.publishInfo.PublishInfo',
			'FBEditor.view.form.desc.customInfo.CustomInfo',
			'FBEditor.view.form.desc.history.History',
			'FBEditor.view.form.desc.annotation.Annotation'
		],
		id: 'form-desc',
		xtype: 'form-desc',
		controller: 'form.desc',
		autoScroll: true,
		minWidth: 800,
		bodyPadding: 0,
		cls: 'form-desc',
		defaults: {
			xtype: 'fieldset',
			collapsible: true,
			anchor: '100%'
		},
		fieldDefaults: {
			labelStyle: '',
			fieldStyle: ''
		},
		listeners: {
			loadDesc: 'onLoadData',
			reset: 'onReset'
		},

		translateText: {
			periodical: 'Периодическое издание',
			title: 'Название произведения',
			sequence: 'Серия, в которой выпущено произведение',
			subjects: 'Связанные персоны (автор, переводчик и т.д.)',
			objects: 'Связанные объекты',
			classification: 'Классификация произведения',
			documentInfo: 'Информация о файле',
			publishInfo: 'Информация о бумажной публикации',
			customInfo: 'Пользовательская информация',
			history: 'История',
			annotation: 'Аннотация'
		},

		statics: {
			/**
			 * @const {String} Цвет необязтаельных полей.
			 */
			ALLOW_COLOR: 'gray',

			/**
			 * @const {String} Шаблон заголовка для наборов необязательных полей, заключенных в fieldset.
			 */
			TITLE_TPL: '{%s}',

			/**
			 * @const {String} Шаблон заголовка для наборов обязательных полей, заключенных в fieldset.
			 */
			TITLE_REQ_TPL: '{%s}'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					title: me.self.TITLE_REQ_TPL.replace('{%s}', me.translateText.title),
					items: [
						{
							xtype: 'form-desc-title',
							name: 'title',
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 160,
								labelAlign: 'right'
							}
						}
					]
				},
				/*{
				 title: me.self.TITLE_TPL.replace('{%s}', me.translateText.sequence),
				 collapsed: true,
				 cls: 'optional',
				 items: [
				 {
				 xtype: 'form-desc-sequence',
				 layout: 'anchor',
				 defaults: {
				 anchor: '100%'
				 }
				 }
				 ]
				 },*/
				{
					title: me.self.TITLE_TPL.replace('{%s}', me.translateText.annotation),
					collapsed: true,
					cls: 'optional',
					items: [
						{
							xtype: 'form-desc-annotation',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				},
				{
					title: me.self.TITLE_TPL.replace('{%s}', me.translateText.periodical),
					collapsed: true,
					cls: 'optional',
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
					title: me.self.TITLE_REQ_TPL.replace('{%s}', me.translateText.classification),
					items: [
						{
							xtype: 'form-desc-classification'
						}
					]
				},
				{
					title: me.self.TITLE_REQ_TPL.replace('{%s}', me.translateText.subjects),
					items: [
						{
							xtype: 'form-desc-relations-subject',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				},
				{
					title: me.self.TITLE_TPL.replace('{%s}', me.translateText.objects),
					collapsed: true,
					cls: 'optional',
					items: [
						{
							xtype: 'form-desc-relations-object',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				},
				{
					title: me.self.TITLE_TPL.replace('{%s}', me.translateText.publishInfo),
					collapsed: true,
					cls: 'optional',
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
					title: me.self.TITLE_TPL.replace('{%s}', me.translateText.history),
					collapsed: true,
					cls: 'optional',
					items: [
						{
							xtype: 'form-desc-history',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				},
				{
					title: me.self.TITLE_TPL.replace('{%s}', me.translateText.customInfo),
					collapsed: true,
					cls: 'optional',
					items: [
						{
							xtype: 'form-desc-customInfo',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				},
				{
					title: me.self.TITLE_REQ_TPL.replace('{%s}', me.translateText.documentInfo),
					items: [
						{
							xtype: 'form-desc-documentInfo',
							layout: 'anchor',
							defaults: {
								xtype: 'textfield',
								anchor: '100%',
								labelWidth: 140,
								labelAlign: 'right',
								margin: '0 0 2 0'
							}
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);