/**
 * Хранилище серий.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.store.desc.sequence.Sequence',
	{
		extend: 'Ext.data.Store',
		storeId: 'desc-sequence',
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
			'name'
		],
		proxy: {
			type: 'ajax',
			url: 'https://hub.litres.ru/pages/machax_sequences/',
			reader: {
				type: 'json',
				rootProperty: 'series'
			}
		}
	}
);