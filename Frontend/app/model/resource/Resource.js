/**
 * Модель ресурса книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.model.resource.Resource',
	{
		extend: 'Ext.data.Model',
		fields: [
			{
				// адрес
				name: 'url',
				type: 'string'
			},
			{
				// название
				name: 'name',
				type: 'string'
			}
		]
	}
);