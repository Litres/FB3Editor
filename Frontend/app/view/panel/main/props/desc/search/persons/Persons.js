/**
 * Родительский контейнер с результатами поиска персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.search.persons.Persons',
	{
		extend: 'FBEditor.view.panel.main.props.desc.search.Container',
		requires: [
			'FBEditor.view.panel.main.props.desc.search.persons.PersonsController',
			'FBEditor.view.container.desc.search.persons.Persons'
		],
		controller: 'props.desc.search.persons',
		xtype: 'props-desc-search-persons',
		id: 'props-desc-search-persons',

		xtypeContainerItems: 'container-desc-search-persons'
	}
);