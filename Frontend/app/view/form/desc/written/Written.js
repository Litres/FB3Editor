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
		items: [
			{
				xtype: 'langfield',
				name: 'written-lang',
				fieldLabel: 'Язык',
				emptyText: 'Язык',
				hideLabel: true,
				allowBlank: true,
				forceSelection: true
			},
			{
				xtype: 'datefield',
				name: 'written-date',
				fieldLabel: 'Дата',
				emptyText: 'Дата',
				hideLabel: true
			},
			{
				xtype: 'countryfield',
				name: 'written-country',
				fieldLabel: 'Страна',
				emptyText: 'Страна',
				forceSelection: false,
				editable: false,
				hideLabel: true
			}
		]
	}
);