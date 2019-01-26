/**
 * Контроллер кнопки поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.button.find.FindController',
	{
		extend: 'FBEditor.view.panel.toolstab.button.AbstractButtonController',
		
		alias: 'controller.panel.toolstab.button.find',
		
		onClick: function (e)
		{
			console.log('click find', e);
		}
	}
);