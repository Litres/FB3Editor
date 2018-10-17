/**
 * Логотип ЛитРес.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.component.logo.Litres',
	{
		extend: 'Ext.Component',
		requires: [
			'FBEditor.view.component.logo.LitresController'
		],
		
		id: 'component-logo-litres',
		xtype: 'component-logo-litres',
		controller: 'component.logo.litres',
		
		cls: 'logo-litres',
		
		listeners: {
			checkPosition: 'onCheckPosition'
		},
		
		floating: true,
		width: 60,
		height: 14,
		autoShow: true,
		shadow: false,
		defaultAlign: 'tr',
		y: 18,
		margin: '0 0 0 -92px',
		
		/**
		 * @property {FBEditor.view.panel.main.tools.Tools} Панель инструментов.
		 */
		mainTools: null,
		
		/**
		 * Корректирует позицию логотипа.
		 */
		checkPosition: function ()
		{
			var me = this,
				marginRight = 32,
				tools,
				dWidth;
			
			if (me.rendered)
			{
				tools = me.getMainTools();
				dWidth = me.getWidth() - marginRight;
				//console.log('pos', tools.getWidth() - dWidth);
				//me.alignTo(Ext.getBody(), 'tr', [-92, 18]);
			}
		},
		
		/**
		 * Возвращает панель иснтрументов.
		 * @return {FBEditor.view.panel.main.tools.Tools}
		 */
		getMainTools: function ()
		{
			var me = this,
				cmp = me.mainTools;
			
			cmp = cmp || Ext.getCmp('panel-main-tools');
			me.mainTools = cmp;
			
			return cmp;
		}
	}
);