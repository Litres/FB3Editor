/**
 * Абстрактная кнопка создания стилевого элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.AbstractStyleButton',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractToggleButton',

		isActiveSelection: function ()
		{
			var manager = FBEditor.getEditorManager(),
				res,
				range;

			range = manager.getRange();
			res = !range.collapsed ? true : false;

			return res;
		}
	}
);