/**
 * Кнопка вставки ul.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.ul.Ul',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractLiHolderButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.ul.UlController'
		],
		id: 'panel-toolstab-main-button-ul',
		xtype: 'panel-toolstab-main-button-ul',
		controller: 'panel.toolstab.main.button.ul',
		html: '<i class="fa fa-list-ul"></i>',
		tooltip: 'Маркированный список',
		elementName: 'ul'
	}
);