/**
 * Абстрактный контейнер для полей формы описания книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.AbstractFieldContainer',
	{
		extend: 'Ext.form.FieldContainer',
		xtype: 'desc-fieldcontainer',
		style: {
			marginBottom: '0px'
		},
		fieldDefaults: {
			labelStyle: 'font-size: 10px; line-height: 1',
			fieldStyle: 'font-size: 10px; line-height: 1'
		}
	}
);