/**
 * Контроллер списка языков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.lang.LangController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.langfield',

		onClick: function ()
		{
			var me = this,
				view = me.getView();

			view.expand();
		}
	}
);