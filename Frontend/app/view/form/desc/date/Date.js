/**
 * Поле даты описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.date.Date',
	{
		extend: 'Ext.form.field.Date',
		requires: [
			'FBEditor.view.form.desc.date.DateController'
		],
		xtype: 'desc-date',
		controller: 'form.desc.date',

		altFormats: 'Y-m-d|d.m.Y',
		format: 'Y-m-d',

		listeners: {
			blur: 'onBlur'
		}
	}
);