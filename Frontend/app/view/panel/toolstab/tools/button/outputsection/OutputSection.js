/**
 * Кнопка настройки ознакомляшки (аттрибут output в section).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.tools.button.outputsection.OutputSection',
	{
		extend: 'Ext.Button',
		requires: [
			'FBEditor.view.window.outputsection.OutputSection'
		],
		
		id: 'panel-toolstab-tools-button-outputsection',
		xtype: 'panel-toolstab-tools-button-outputsection',
		
		tooltipType: 'title',
		html: '<i class="fa fa-check-square"></i>',
		
		/**
		 * @private
		 * @property {FBEditor.view.window.outputsection.OutputSection} Окно настройки ознакомляшки.
		 */
		win: null,
		
		translateText: {
			tooltip: 'Настроить ознакомляшку'
		},
		
		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;
			
			me.tooltip = tt.tooltip;
			
			me.callParent(arguments);
		},
		
		handler: function ()
		{
			var me = this,
				win;
			
			win = me.getWindow();
			win.show();
		},
		
		/**
		 * Возвращает окно настройки ознакомляшки.
		 * @return {FBEditor.view.window.outputsection.OutputSection}
		 */
		getWindow: function ()
		{
			var me = this,
				win;
			
			win = Ext.create('FBEditor.view.window.outputsection.OutputSection');
			me.win = win;
			
			return win;
		}
	}
);