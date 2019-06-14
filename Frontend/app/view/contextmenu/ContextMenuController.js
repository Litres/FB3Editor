/**
 * Контроллер контескстного меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.contextmenu.ContextMenuController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.contextmenu',
		
		onContextMenu: function (evt)
		{
			// предотвращаем открытие браузерного контестного меню
			evt.preventDefault();
		}
	}
);