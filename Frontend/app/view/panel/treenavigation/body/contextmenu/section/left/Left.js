/**
 * Сдвиг секции влево.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.left.Left',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.section.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.left.LeftController',
			'FBEditor.editor.command.section.LeftCommand'
		],
		
		xtype: 'contextmenu-treenavigation-body-section-left',
		controller: 'contextmenu.treenavigation.body.section.left',
		
		text: 'Сдвинуть влево (убрать вложенность)',
		
		isActive: function ()
		{
			var me = this,
				parent,
				el,
				active;
			
			active = me.callParent(arguments);
			
			if (active)
			{
				el = me.getElement();
				
				// родительская секция
				parent = el.getParent();
				
				active = parent && parent.isSection;
			}
			
			return active;
		}
	}
);