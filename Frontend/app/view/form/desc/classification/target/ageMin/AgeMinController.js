/**
 * Контроллер минимального возраста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.target.ageMin.AgeMinController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.classification.target.agemin',

		onClick: function ()
		{
			var me = this,
				view = me.getView();

			view.expand();
		}
	}
);