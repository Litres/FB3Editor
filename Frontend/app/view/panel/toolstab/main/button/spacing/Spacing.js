/**
 * Кнопка создания элемента spacing.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.spacing.Spacing',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractStyleButton',
		id: 'panel-toolstab-main-button-spacing',
		xtype: 'panel-toolstab-main-button-spacing',
		//controller: 'panel.toolstab.main.button.spacing',
		html: '<i class="fa fa-text-width"></i>',
		tooltip: 'Межбуквенный интервал (Ctrl+Shift+I)',
		elementName: 'spacing'
	}
);