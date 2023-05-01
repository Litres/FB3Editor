/**
 * Хранилище персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.store.desc.relations.Subject',
	{
		extend: 'Ext.data.Store',
		storeId: 'desc-relations-subject',
		pageSize: 50,
		sorters: [
			{
				property: 'last_name',
				direction: 'ASC'
			},
			{
				property: 'first_name',
				direction: 'ASC'
			},
			{
				property: 'middle_name',
				direction: 'ASC'
			}
		],
		fields: [
			'id',
			'uuid',
			'last_name',
			'first_name',
			'middle_name'
		],
		proxy: {
			type: 'ajax',
			url: Ext.manifest.hubApiEndpoint + '/pages/machax_persons/',
			reader: {
				type: 'json',
				rootProperty: 'persons'
			}
		}
	}
);