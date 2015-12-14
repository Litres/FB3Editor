/**
 * Хранилище названий.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.arts.ArtsStore',
	{
		extend: 'FBEditor.store.AbstractStore',

		/**
		 * @property {String} URL запроса.
		 */
		url: 'https://hub.litres.ru/pages/machax_arts/',

		rootProperty: 'arts'
	}
);