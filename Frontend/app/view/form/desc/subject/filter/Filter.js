/**
 * Фильтр по жанрам.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.filter.Filter',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.form.desc.subject.filter.FilterController'
		],
		xtype: 'form-desc-subject-filter',
		controller: 'form.desc.subject.filter',
		inputType: 'search',
		checkChangeBuffer: 500,
		width: '100%',
		emptyText: 'Фильтр по жанрам',
		listeners: {
			change: 'onChange'
		}
	}
);