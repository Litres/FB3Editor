/**
 * Окно с результатами поиска персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.name.resultContainer.ResultContainer',
	{
		extend: 'FBEditor.view.form.desc.searchField.Window',
		requires: [
			'FBEditor.view.form.desc.relations.subject.search.name.resultContainer.ResultContainerController'
		],
		xtype: 'form-desc-relations-subject-searchName-resultContainer',
		controller: 'form.desc.relations.subject.searchName.resultContainer',

		xtypeContainerItems: 'panel-persons'
	}
);