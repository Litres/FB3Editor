/**
 * Хранилище списка жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.tree.Store',
	{
		extend: 'Ext.data.TreeStore',

		defaultRootProperty: 'genre',

		proxy: {
			type: 'memory'
		}
	}
);