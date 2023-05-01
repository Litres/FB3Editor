/**
 * Хранилище тегов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.tag.TagStore',
	{
		extend: 'FBEditor.store.AbstractStore',

		url: Ext.manifest.hubApiEndpoint + '/pages/tags_search'
	}
);