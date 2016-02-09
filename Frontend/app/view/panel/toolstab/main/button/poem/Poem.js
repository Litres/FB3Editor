/**
 * Кнопка вставки блока poem.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.poem.Poem',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.poem.PoemController'
		],
		id: 'panel-toolstab-main-button-poem',
		xtype: 'panel-toolstab-main-button-poem',
		controller: 'panel.toolstab.main.button.poem',
		html: '<i class="fa fa-pinterest fa-lg"></i>',
		tooltip: 'Поэма',
		elementName: 'poem'
	}
);