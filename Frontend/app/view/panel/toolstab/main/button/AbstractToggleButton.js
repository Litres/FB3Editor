/**
 * Абстрактная кнопка элемента с возможностью переключения состояния.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.AbstractToggleButton',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.ToggleButtonController'
		],
		controller: 'panel.toolstab.main.togglebutton',
		enableToggle: true
	}
);