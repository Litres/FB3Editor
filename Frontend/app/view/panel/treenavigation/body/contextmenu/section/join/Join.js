/**
 * Объединение секции с предыдущей.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.join.Join',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.section.Item',
		requires: [
			'FBEditor.editor.command.section.JoinCommand',
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.join.JoinController'
		],
		
		xtype: 'contextmenu-treenavigation-body-section-join',
		controller: 'contextmenu.treenavigation.body.section.join',
		
		text: 'Объединить главу с предыдущей',
		
		isActive: function ()
		{
			var me = this,
				el = me.getElement(),
				prev,
				active;
			
			active = me.callParent(arguments);
			
			if (active)
			{
				prev = el.prev();
				active = prev ? prev.isSection : false;
			}
			
			return active;
		}
	}
);