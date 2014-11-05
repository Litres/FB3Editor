/**
 * Хранилище списка стран.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.country.CountryStore',
	{
		extend: 'Ext.data.Store',
		fields: [
			'value',
			'name'
		],
		proxy: {
			type: 'ajax',
			url: '/data/country/ru/country.json',
			reader: {
				type: 'json'
			}
		},
		autoLoad: true
	}
);