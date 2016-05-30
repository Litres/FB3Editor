/**
 * Абстрактная кнопка элемента с возможностью переключения состояния.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.AbstractToggleButton',
	{
		extend: 'FBEditor.editor.view.toolbar.button.AbstractButton',
		requires: [
			'FBEditor.editor.view.toolbar.button.ToggleButtonController'
		],

		controller: 'editor.toolbar.button.togglebutton',

		enableToggle: true
	}
);