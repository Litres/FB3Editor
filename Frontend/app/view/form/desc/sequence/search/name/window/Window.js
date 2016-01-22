/**
 * Окно с результатами поиска серий.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.search.name.window.Window',
	{
		extend: 'FBEditor.view.form.desc.searchField.Window',
		requires: [
			'FBEditor.view.form.desc.sequence.search.name.window.WindowController',
			'FBEditor.view.container.desc.search.sequence.Sequence'
		],
		xtype: 'form-desc-sequence-searchName-window',
		controller: 'form.desc.sequence.searchName.window',

		width: 470,

		xtypeContainerItems: 'container-desc-search-sequence'
	}
);