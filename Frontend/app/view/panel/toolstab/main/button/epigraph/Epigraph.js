/**
 * Кнопка вставки эпиграфа.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.epigraph.Epigraph',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.epigraph.EpigraphController'
		],
		id: 'panel-toolstab-main-button-epigraph',
		xtype: 'panel-toolstab-main-button-epigraph',
		controller: 'panel.toolstab.main.button.epigraph',
		html: '<i class="fa fa-pinterest-p"></i>',
		tooltip: 'Эпиграф (Ctrl+E)',
		elementName: 'epigraph'
	}
);