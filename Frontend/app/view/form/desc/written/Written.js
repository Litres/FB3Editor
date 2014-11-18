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
			labelAlign: 'top',
			flex: 1,
			msgTarget: 'none',
			margin: '0 2 0 0'
		},

		translateText: {
			lang: 'Язык',
			date: 'Дата',
			dateText: 'Описание даты',
			country: 'Страна'
		},

		initComponent: function ()
		{
			var me = this,
				labelStyleAllow = me.fieldDefaults.labelStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

			me.items = [
				{
					xtype: 'langfield',
					name: 'written-lang',
					fieldLabel: me.translateText.lang,
					allowBlank: false,
					forceSelection: true
				},
				{
					xtype: 'datefield',
					name: 'written-date-value',
					fieldLabel: me.translateText.date,
					labelStyle: labelStyleAllow
				},
				{
					xtype: 'textfield',
					name: 'written-date-text',
					fieldLabel: me.translateText.dateText,
					labelStyle: labelStyleAllow
				},
				{
					xtype: 'countryfield',
					name: 'written-country',
					fieldLabel: me.translateText.country,
					forceSelection: false,
					editable: false,
					labelStyle: labelStyleAllow
				}
			];
			me.callParent(arguments);
		}
	}
);