/**
 * Хранилище ресурсов книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.store.resource.Resource',
	{
		extend: 'Ext.data.Store',
		requires: [
			'FBEditor.model.resource.Resource'
		],
		model: 'FBEditor.model.resource.Resource'
	}
);