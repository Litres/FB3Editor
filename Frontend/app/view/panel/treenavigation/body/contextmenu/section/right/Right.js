/**
 * Сдвиг секции вправо.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.right.Right',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.section.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.right.RightController',
			'FBEditor.editor.command.section.RightCommand'
		],
		
		xtype: 'contextmenu-treenavigation-body-section-right',
		controller: 'contextmenu.treenavigation.body.section.right',
		
		text: 'Сдвинуть вправо (сделать вложенной)',
		
		isActive: function ()
		{
			var me = this,
				sectionPrev,
				el,
				active;
			
			active = me.callParent(arguments);
			
			if (active)
			{
				el = me.getElement();
				
				// предыдущая секция
				sectionPrev = el.prev();
				
				active = sectionPrev && sectionPrev.isSection;
			}
			
			return active;
		}
	}
);