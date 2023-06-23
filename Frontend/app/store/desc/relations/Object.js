/**
 * Хранилище объектов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.store.desc.relations.Object',
	{
		extend: 'Ext.data.Store',
		storeId: 'desc-relations-object',
		pageSize: 50,
		sorters: [
			{
				property: 'name',
				direction: 'ASC'
			}
		],
		fields: [
			'id',
			'uuid',
			'name',
			'persons',
		    'series'
		],
		proxy: {
			type: 'ajax',
			url: Ext.manifest.hubApiEndpoint + '/pages/machax_arts/',
			reader: {
				type: 'json',
				rootProperty: 'arts'
			}
		}
	}
);