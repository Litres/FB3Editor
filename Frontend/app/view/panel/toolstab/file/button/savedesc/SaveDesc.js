/**
 * Кнопка сохранения описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.savedesc.SaveDesc',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.panel.toolstab.file.button.savedesc.SaveDescController'
		],
		
		id:'panel-toolstab-file-button-savedesc',
		xtype: 'panel-toolstab-file-button-savedesc',
		controller: 'panel.toolstab.file.button.savedesc',
		
		listeners: {
			click: 'onClick',
			accessHub: 'onAccessHub'
		},

		disabled: true,
		iconCls: 'fa fa-cloud-download',
		tooltipType: 'title',

		translateText: {
			save: 'Сохранить описание (хаб)'
		},

		initComponent: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				routeManager = bridge.FBEditor.route.Manager;
			
			// скрываем
			me.hidden = routeManager.isSetParam('only_text');

			me.text = me.translateText.save;
			me.tooltip = me.translateText.save;

			me.callParent(arguments);
		},

		/**
		 * Активирует или деактивирует кнопку.
		 * @param {Boolean} active Активировать ли.
		 */
		setActive: function (active)
		{
			var me = this;

			me.setDisabled(!active);
		}
	}
);