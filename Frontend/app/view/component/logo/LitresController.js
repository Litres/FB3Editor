/**
 * Контроллер логотипа.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.component.logo.LitresController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.component.logo.litres',
		
		onCheckPosition: function ()
		{
			var me = this,
				view = me.getView();
			
			view.checkPosition();
		}
	}
);