/**
 * Абстрактная кнопка элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.AbstractButton',
	{
		extend: 'FBEditor.editor.view.toolbar.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.ButtonController'
		],

		controller: 'panel.toolstab.main.button'
	}
);