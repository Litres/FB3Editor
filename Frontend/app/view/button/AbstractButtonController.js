/**
 * Контроллер абстрактной кнопки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.AbstractButtonController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.view.button',
		
		/**
		 * @template
		 */
		onClick: function ()
		{
			// необходимо переопределить в наследуемом классе
		}
	}
);