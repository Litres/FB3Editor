/**
 * Хранилище серий.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.sequence.SequenceStore',
	{
		extend: 'FBEditor.store.AbstractStore',

		url: 'https://hub.litres.ru/pages/machax_sequences/',

		rootProperty: 'series'
	}
);