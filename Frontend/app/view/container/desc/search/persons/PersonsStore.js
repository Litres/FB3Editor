/**
 * Хранилище персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.persons.PersonsStore',
	{
		extend: 'FBEditor.store.AbstractStore',

		/**
		 * @property {String} URL запроса.
		 */
		url: Ext.manifest.hubApiEndpoint + '/pages/machax_persons/',

		rootProperty: 'persons'
	}
);