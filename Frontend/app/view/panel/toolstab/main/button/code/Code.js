/**
 * Кнопка создания элемента code.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.code.Code',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractStyleButton',
		id: 'panel-toolstab-main-button-code',
		xtype: 'panel-toolstab-main-button-code',
		//controller: 'panel.toolstab.main.button.code',
		html: '<span style="position: relative; font-family: monospace; font-size: 1.4em; top: 2px;">M</span>',
		tooltip: 'Моноширинный (Ctrl+M)',
		elementName: 'code'
	}
);