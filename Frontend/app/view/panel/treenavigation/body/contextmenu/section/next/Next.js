/**
 * Добавление секции ниже.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.next.Next',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.section.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.next.NextController'
		],
		
		xtype: 'contextmenu-treenavigation-body-section-next',
		controller: 'contextmenu.treenavigation.body.section.next',
		
		text: 'Добавить главу ниже'
	}
);