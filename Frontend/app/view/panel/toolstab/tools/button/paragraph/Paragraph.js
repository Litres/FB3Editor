/**
 * Кнопка включения режима отображения символа конца абзаца в редакторе текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.tools.button.paragraph.Paragraph',
	{
		extend: 'Ext.Button',

		id: 'panel-toolstab-tools-button-paragraph',
		xtype: 'panel-toolstab-tools-button-paragraph',

		enableToggle: true,
		tooltipType: 'title',
		html: '<i class="fa fa-paragraph"></i>',
		tooltip: 'Отображение конца абзацев',

		/**
		 * @property {String} CSS-Класс для включения отображения абзацев.
		 */
		modeCls: 'mode-paragraph',

		handler: function ()
		{
			var me = this,
				isPressed = me.isPressed(),
				modeCls = me.modeCls,
				viewports;

			viewports = document.querySelectorAll('.editor-viewport');

			Ext.Array.each(
				viewports,
			    function (item)
			    {
				    if (isPressed)
				    {
					    item.classList.add(modeCls);
				    }
				    else
				    {
					    item.classList.remove(modeCls);
				    }
			    }
			)
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