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
			'FBEditor.view.field.textfieldclear.TextFieldClear',
			'FBEditor.view.form.desc.DescController',
			'FBEditor.view.form.desc.AbstractFieldContainer',
			'FBEditor.view.form.desc.fieldset.AbstractFieldsetInner',
			'FBEditor.view.form.desc.fieldset.Title',
			'FBEditor.view.form.desc.fieldset.annotation.Annotation',
			'FBEditor.view.form.desc.fieldset.periodical.Periodical',
			'FBEditor.view.form.desc.fieldset.Classification',
			'FBEditor.view.form.desc.fieldset.RelationsSubject',
			'FBEditor.view.form.desc.fieldset.RelationsObject',
			'FBEditor.view.form.desc.fieldset.history.History',
			'FBEditor.view.form.desc.fieldset.CustomInfo',
			'FBEditor.view.form.desc.fieldset.PublishInfo',
			'FBEditor.view.form.desc.fieldset.DocumentInfo',
			'FBEditor.view.form.desc.sequence.Sequence'
		],
		id: 'form-desc',
		xtype: 'form-desc',
		controller: 'form.desc',
		autoScroll: true,
		minWidth: 800,
		bodyPadding: 0,
		cls: 'form-desc',
		listeners: {
			loadDesc: 'onLoadData',
			reset: 'onReset'
		},

		translateText: {
			sequence: 'Серия, в которой выпущено произведение'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldset-title'
				},
				/*
				{
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
				 },
				 */
				{
					xtype: 'desc-fieldset-annotation'
				},
				{
					xtype: 'desc-fieldset-classification'
				},
				{
					xtype: 'desc-fieldset-relations-subject'
				},
				{
					xtype: 'desc-fieldset-periodical'
				},
				{
					xtype: 'desc-fieldset-relations-object'
				},
				{
					xtype: 'desc-fieldset-publishInfo'
				},
				{
					xtype: 'desc-fieldset-history'
				},
				{
					xtype: 'desc-fieldset-customInfo'
				},
				{
					xtype: 'desc-fieldset-documentInfo'
				}
			];
			me.callParent(arguments);
		}
	}
);