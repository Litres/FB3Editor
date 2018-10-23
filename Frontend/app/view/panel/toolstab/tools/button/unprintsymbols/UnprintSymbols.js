/**
 * Кнопка включения режима отображения непечатаемых символов в редакторе текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.tools.button.unprintsymbols.UnprintSymbols',
	{
		extend: 'Ext.Button',

		id: 'panel-toolstab-tools-button-unprintsymbols',
		xtype: 'panel-toolstab-tools-button-unprintsymbols',

		enableToggle: true,
		tooltipType: 'title',
		//html: '<i class="fa fa-paragraph"></i>',
		iconCls: 'litres-icon-paragraph',
		tooltip: 'Показывать непечатаемые символы в редакторе текста',

		handler: function ()
		{
			var me = this,
				isPressed = me.isPressed(),
				viewports;

			// получаем все контейнеры редактирования текста
			viewports = Ext.ComponentQuery.query('editor-viewport');

			Ext.each(
				viewports,
				function (viewport)
				{
					viewport.showUnprintedSymbols(isPressed);
				}
			);
		},

		/**
		 * Нажата ли кнопка.
		 * @return {Boolean}
		 */
		isPressed: function ()
		{
			return this.pressed;
		}
	}
);