/**
 * Кнопка замены в тексте.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.button.replace.Replace',
	{
		extend: 'FBEditor.view.panel.toolstab.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.button.replace.ReplaceController'
		],
		
		id: 'panel-toolstab-button-replace',
		xtype: 'panel-toolstab-button-replace',
		controller: 'panel.toolstab.button.replace',
		
		numberSlot: 33,
		disabled: true,
		tooltipText: 'Поиск и замена',
		text: 'Поиск и замена...'
	}
);