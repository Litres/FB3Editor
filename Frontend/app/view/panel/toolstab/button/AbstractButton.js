/**
 * Абстрактная кнопка панели инструментов.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.button.AbstractButton',
	{
		extend: 'FBEditor.view.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.button.AbstractButtonController'
		],
		
		xtype: 'panel-toolstab-button',
		controller: 'panel.toolstab.button'
	}
);