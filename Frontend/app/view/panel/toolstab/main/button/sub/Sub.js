/**
 * Кнопка создания элемента sub.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.sub.Sub',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractStyleButton',
		id: 'panel-toolstab-main-button-sub',
		xtype: 'panel-toolstab-main-button-sub',
		//controller: 'panel.toolstab.main.button.sub',
		html: '<i class="fa fa-subscript"></i>',
		tooltip: 'Нижний индекс',
		elementName: 'sub'
	}
);