/**
 * Дата и место написания произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.written.Written',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-written',
		id: 'form-desc-written',
		fieldLabel: 'Дата и место написания',
		layout: 'hbox',
		combineErrors: true,
		msgTarget: 'side',
		labelWidth: 140,
		labelAlign: 'right',
		defaults: {
			flex: 1,
			msgTarget: 'none',
			margin: '0 2 0 0'
		},

		translateText: {
			lang: 'Язык',
			date: 'Дата',
			country: 'Страна'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'langfield',
					name: 'written-lang',
					fieldLabel: me.translateText.lang,
					emptyText: me.translateText.lang,
					hideLabel: true,
					allowBlank: false,
					forceSelection: true
				},
				{
					xtype: 'datefield',
					name: 'written-date',
					fieldLabel: me.translateText.date,
					emptyText: me.translateText.date,
					hideLabel: true
				},
				{
					xtype: 'countryfield',
					name: 'written-country',
					fieldLabel: me.translateText.country,
					emptyText: me.translateText.country,
					forceSelection: false,
					editable: false,
					hideLabel: true
				}
			];
			me.callParent(arguments);
		}
	}
);