/**
 * Абстрактная кнопка элемента с возможностью переключения состояния.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.AbstractToggleButton',
	{
		extend: 'FBEditor.editor.view.toolbar.button.AbstractToggleButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.ToggleButtonController'
		],

		controller: 'main.editor.togglebutton'
	}
);