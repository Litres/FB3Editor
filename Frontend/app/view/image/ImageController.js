/**
 * контроллер базового компонента изображения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.image.ImageController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.baseimage',
		
		onLoad: function ()
		{
			var me = this,
				view = me.getView();
			
			//console.log('load', view);
		}
	}
);