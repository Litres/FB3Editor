/**
 * Кнопка поиска в тексте.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.button.find.Find',
	{
		extend: 'FBEditor.view.panel.toolstab.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.button.find.FindController'
		],
		
		id: 'panel-toolstab-button-find',
		xtype: 'panel-toolstab-button-find',
		controller: 'panel.toolstab.button.find',
		
		numberSlot: 32,
		disabled: true,
		tooltipText: 'Поиск',
		text: 'Поиск...'
	}
);