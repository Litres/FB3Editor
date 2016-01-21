/**
 * Хранилище названий.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.arts.ArtsStore',
	{
		extend: 'FBEditor.store.AbstractStore',

		url: 'https://hub.litres.ru/pages/machax_arts/',

		rootProperty: 'arts'
	}
);