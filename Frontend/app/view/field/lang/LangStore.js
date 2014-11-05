/**
 * Хранилище списка языков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.lang.LangStore',
	{
		extend: 'Ext.data.Store',
		fields: [
			'value',
			'name'
		],
		proxy: {
			type: 'ajax',
			url: '/data/lang/ru/lang.json',
			reader: {
				type: 'json'
			}
		},
		autoLoad: true
	}
);