/**
 * Периодическое издание.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.periodical.Periodical',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.fieldset.periodical.PeriodicalController',
			'FBEditor.view.form.desc.periodical.Periodical'
		],
		xtype: 'desc-fieldset-periodical',
		id: 'desc-fieldset-periodical',
		controller: 'desc.fieldset.periodical',
		title: 'Периодическое издание',
		cls: 'desc-fieldset-periodical',
		xtypeChild: 'periodical'
	}
);