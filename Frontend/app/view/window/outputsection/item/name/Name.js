/**
 * Заголовок секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.outputsection.item.name.Name',
	{
		extend: 'Ext.Component',
		
		xtype: 'window-outputsection-item-name',
		
		padding: '4px 0 0 5px',
		
		/**
		 * @property {String} Заголовок секции.
		 */
		sectionName: '',
		
		translateText: {
			default: 'Нет заголовка'
		},
		
		initComponent: function (cfg)
		{
			var me = this,
				tt = me.translateText,
				name;
			
			if (!me.sectionName)
			{
				me.style = {
					color: 'lightgray'
				};
			}
			
			name = me.sectionName || tt.default;
			me.html = name;
			
			me.callParent(arguments);
		}
	}
);