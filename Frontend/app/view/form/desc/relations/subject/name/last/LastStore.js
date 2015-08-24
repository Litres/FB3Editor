/**
 * Хранилище фамилий персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.last.LastStore',
	{
		extend: 'Ext.data.Store',
		pageSize: 50,
		sorters: [
			{
				property: 'last_name',
				direction: 'ASC'
			}
		],
		fields: [
			'id',
			'uuid',
			'first_name',
		    'last_name',
		    'middle_name'
		],
		proxy: {
			type: 'ajax',
			url: 'https://hub.litres.ru/pages/machax_persons/',
			reader: {
				type: 'json',
				rootProperty: 'persons'
			}
		}
	}
);