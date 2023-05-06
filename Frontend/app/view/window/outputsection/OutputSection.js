/**
 * Окно настройки ознакомляшки (аттрибут output для section).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.outputsection.OutputSection',
	{
		extend: 'Ext.Window',
		requires: [
			'FBEditor.view.window.outputsection.item.Item'
		],
		
		xtype: 'window-outputsection',
		id: 'window-outputsection',
		
		modal: true,
		scrollable: 'y',
		
		translateText: {
			title: 'Настройка ознакомляшки'
		},
		
		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;
			
			me.title = tt.title;
			
			me.callParent(arguments);
		},
		
		afterRender: function ()
		{
			var me = this,
				sections;
			
			sections = me.getSections();
			me.add(sections);
			
			me.callParent(arguments);
		},

		// иногда попадаются оглавления с большим количеством элементов
		// по этому устанавливаем максимальную высоту окна
		afterShow : function() {
			var me = this;

			var height = Ext.getBody().getViewSize().height;
			var maxHeight = height * 0.8;
			if (me.getHeight() > maxHeight) {
				me.setHeight(maxHeight);
			}
			me.center();
			me.setAutoScroll(true);
		},
		
		/**
		 * Возвращает компоненты всех верхних секций.
		 * @return {FBEditor.view.window.outputsection.item.Item[]}
		 */
		getSections: function ()
		{
			var me = this,
				manager = FBEditor.getEditorManager(),
				sections = [],
				sectionsData;
			
			sectionsData = manager.getSectionsData();
			
			Ext.each(
				sectionsData,
				function (item)
				{
					var cmp;
					
					// компонент настройки отдельной секции
					cmp = {
						xtype: 'window-outputsection-item',
						sectionEl: item.el,
						sectionName: item.name,
						sectionOutput: item.output
					};
					
					sections.push(cmp);
				}
			);
			
			return sections;
		}
	}
);