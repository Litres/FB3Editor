/**
 * Контроллер кнопки переключения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toggleButton.ToggleButtonController',
	{
		extend: 'Ext.app.ViewController',

		alias: 'controller.editor.toggleButton',

		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				isPressed = view.pressed;

			if (isPressed)
			{
				view.switchToSource();
			}
			else
			{
				view.switchToText();
			}
		}
	}
);