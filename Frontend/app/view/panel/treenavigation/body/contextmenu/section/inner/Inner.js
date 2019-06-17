/**
 * Добавление вложенной секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.inner.Inner',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.section.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.inner.InnerController'
		],
		
		xtype: 'contextmenu-treenavigation-body-section-inner',
		controller: 'contextmenu.treenavigation.body.section.inner',
		
		text: 'Добавить вложенную главу'
	}
);