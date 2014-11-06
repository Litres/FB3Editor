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
			'FBEditor.view.form.desc.title.Title',
			'FBEditor.view.form.desc.bookClass.BookClass',
			'FBEditor.view.form.desc.subject.Subject',
			'FBEditor.view.form.desc.relations.Relations',
			'FBEditor.view.form.desc.classification.Classification',
			'FBEditor.view.form.desc.written.Written',
			'FBEditor.view.form.desc.info.Info'
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

		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					title: 'Название произведения',
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
					title: 'Все связанные с данным документом персоны и объекты',
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
					title: 'Классификация произведения',
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
					fieldLabel: 'Язык',
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
					title: 'Информация о файле',
					items: [
						{
							xtype: 'form-desc-info',
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
					fieldLabel: 'Ключевые слова',
					labelWidth: 200,
					labelAlign: 'right',
					msgTarget: 'side',
					style: {
						paddingBottom: '5px'
					}
				}
			];
			me.callParent(arguments);
		}
	}
);