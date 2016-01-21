/**
 * Окно с результатами поиска персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.name.window.Window',
	{
		extend: 'FBEditor.view.form.desc.searchField.Window',
		requires: [
			'FBEditor.view.form.desc.relations.subject.search.name.window.WindowController',
			'FBEditor.view.container.desc.search.persons.Persons'
		],
		xtype: 'form-desc-relations-subject-searchName-window',
		controller: 'form.desc.relations.subject.searchName.window',

		xtypeContainerItems: 'container-desc-search-persons'
	}
);