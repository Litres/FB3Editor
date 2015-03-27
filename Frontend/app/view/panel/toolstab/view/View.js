/**
 * Вкладка Вид.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.view.View',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.toolstab.view.button.split.Split'
		],
		id:'panel-toolstab-view',
		xtype: 'panel-toolstab-view',
		title: 'Вид',

		initComponent: function ()
		{
			var me = this;

			me.tbar = [
				{
					xtype: 'panel-toolstab-view-button-split'
				}
			];
			me.callParent(this);
		}
	}
);